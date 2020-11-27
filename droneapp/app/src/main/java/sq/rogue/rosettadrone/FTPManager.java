package sq.rogue.rosettadrone;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.nio.ByteBuffer;

import static com.MAVLink.common.msg_file_transfer_protocol.MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL;

public class FTPManager {
    private MainActivity parent;
    private DroneModel mModel;
    private File currentFile;
    private byte[] currentFileInBytes;

    public FTPManager(MainActivity parent, DroneModel mModel) {
        this.parent = parent;
        this.mModel = mModel;
        this.currentFile = null;
        this.currentFileInBytes = null;
    }

    public int getOffset(short[] payload){
//        parent.logMessageDJI("CAME HERE!");
        byte[] byteArray = new byte[4];

        for(int i = 0; i <= 3; i++){
            int added = 8 + i;
            short x = new Short(payload[added]);
            byteArray[i] = (byte)(x & 0xff);
        };
        int offset = ByteBuffer.wrap(byteArray).getInt();
        return offset;
    }

    public void fetchFiles(int offset){
        parent.logMessageDJI("Getting files");
        parent.getFilesDir();
        if(parent.mediaFileList.size() < offset) {
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 10, 0);
        } else {
            String dir_items = "";
            String add_dir = "";
            for (int i = offset; i < parent.mediaFileList.size(); i++) {
                add_dir = "F" + parent.mediaFileList.get(i).getFileName() + "\\t" + parent.mediaFileList.get(i).getFileSize() + "\\0";
                if (dir_items.getBytes().length + add_dir.getBytes().length < (251 - 12)) {
                    dir_items += add_dir;
                }
            }
            parent.logMessageDJI("total: " + dir_items.getBytes().length + ": " + dir_items);

            mModel.send_command_ftp_string_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, dir_items, null);
        }
    }

    public void openFile(int file_id, int session_id){
        parent.logMessageDJI("Download file by index " + file_id);
        parent.currentProgress = 0;
        if(parent.lastDownloadedIndex != file_id) {
            parent.downloadFileByIndex(file_id);
            // wait for done
            while (parent.currentProgress != -1) ;
        }
        if(!parent.downloadError){
            byte[] header = new byte[12];
            header[2] = (byte)session_id;
            header[4] = 4;
            parent.logMessageDJI(parent.last_downloaded_file);
            try {
                currentFile = new File(parent.last_downloaded_file);
            } catch (Exception e){
                parent.logMessageDJI(e.toString());
            }
            // convert to byte array
            try (InputStream is = new FileInputStream(currentFile)) {
                if (currentFile.length() > Integer.MAX_VALUE) {
                    mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 1, 0);
                    parent.logMessageDJI("File to big!");
                }
                int byte_offset = 0;
                int bytesRead;
                currentFileInBytes = new byte[(int) currentFile.length()];
                parent.logMessageDJI("Current file in bytes: " + currentFileInBytes.length);
                while (byte_offset < currentFileInBytes.length
                        && (bytesRead = is.read(currentFileInBytes, byte_offset, currentFileInBytes.length - byte_offset)) >= 0) {
                    byte_offset += bytesRead;
                }
            } catch (FileNotFoundException e) {
                mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 10, 0);
                parent.logMessageDJI("FileNotFoundException: " + e.toString());
                return;
            } catch (IOException e) {
                mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 1, 0);
                parent.logMessageDJI("IOException: " + e.toString());
                return;
            }
            int file_size = (int)currentFile.length();
            parent.logMessageDJI("File size: " + file_size);
            mModel.send_command_ftp_string_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, file_size + "", null);
            parent.logMessageDJI("Opened image " + currentFile.getName());
        } else {
            parent.logMessageDJI("There was an error");
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 1, 0);
        }
    }

    public static class SendThread implements Runnable {
        private boolean stopRequested = false;

        private MainActivity parent;
        private DroneModel mModel;
        private File currentFile;
        private byte[] currentFileInBytes;
        public SendThread(MainActivity parent, DroneModel mModel, byte[] currentFileInBytes, File currentFile) {
            this.parent = parent;
            this.mModel = mModel;
            this.currentFile = currentFile;
            this.currentFileInBytes = currentFileInBytes;
        }

        public synchronized void requestStop() {
            this.stopRequested = true;
        }

        public synchronized  boolean isStopRequested() {
            return this.stopRequested;
        }

        private void sleep(long millis){
            try {
                Thread.sleep(millis);
            } catch (InterruptedException e){
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            parent.logMessageDJI("Sending file in second thread.");

            int session_id = 1;
            int offset = 0;

            int payload_data_size = (251-12);
            int total_messages = currentFileInBytes.length/payload_data_size;

            parent.logMessageDJI("total: " + total_messages);

            //prepare data for anti crashing?
            byte[][] data = new byte[total_messages][251];

            for (int i = 0; i < total_messages; i++){

                int startByte = payload_data_size * i;

                data[i][2] = (byte)session_id;

                for (int j = 0; j < payload_data_size; j++) {
                    int added = j + 12;
                    int byte_to_get = startByte + j;
                    if(byte_to_get >= currentFileInBytes.length){
                        data[i][added] = (byte)0;
                    } else {
                        data[i][added] = currentFileInBytes[byte_to_get];
                    }
                }
            }

            try {
                for (int i = 0; i < data.length; i++) {
                    if (isStopRequested()) {
                        return;
                    }
                    mModel.send_command_ftp_bytes_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, data[i]);
                    if (i % 500 == 0 && i != 0) {
                        sleep(100);
                    }
//                    int startByte = payload_data_size * c;
//                    int bytes_to_add_size = payload_data_size;
//
//                    if (startByte + 251 > currentFileInBytes.length) {
//                        bytes_to_add_size = currentFileInBytes.length - (startByte + 251);
//                    }
//
//                    if (bytes_to_add_size > 0) {
//                        try {
//                            for (int i = 0; i < bytes_to_add_size; i++) {
//                                int added = i + 12;
//                                int byte_to_get = startByte + i;
//                                data[added] = currentFileInBytes[byte_to_get];
//                            }
//
//                            mModel.send_command_ftp_bytes_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, data);
//                        } catch (Exception e) {
//                            parent.logMessageDJI(e.toString());
//                            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 6, 0);
//                        }
//                    } else {
//                        mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 6, 0);
//                    }
                }
                mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 6, 0);
                parent.logMessageDJI("Done sending image");
            } catch (Exception e){
                parent.logMessageDJI("Could not finish sending image");
                parent.logMessageDJI("Error: " + e.toString());
            }
        }

    }

    public void readFile(int session_id, int offset){
//        parent.logMessageDJI("Read file");
        if(currentFile == null || currentFile.length() == 0){
            parent.logMessageDJI("File is null, sending error code");
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 10, 0);
            return;
        }

        int payload_data_size = (251-12);

        if(offset > (currentFileInBytes.length/payload_data_size) ){
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 6, 0);
            return;
        }

        SendThread newThread = new SendThread(parent, mModel, currentFileInBytes, currentFile);
        Thread thread = new Thread(newThread, "SendThread");
        thread.start();
        parent.logMessageDJI("Started sending thread, should continue now...");

    }
}

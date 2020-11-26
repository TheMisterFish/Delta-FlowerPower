package sq.rogue.rosettadrone;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
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
        parent.logMessageDJI("CAME HERE!");
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

            mModel.send_command_ftp_string_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, dir_items);
        }
    }

    public void openFile(int file_id, int session_id){
//        int file_id = new Short(msg_ftp_item.payload[12]).intValue();
        parent.downloadFileByIndex(file_id);
        // wait for done
        while (parent.currentProgress != -1);

        if(parent.downloadError == -1){
            byte[] data = new byte[251];
            data[2] = (byte)session_id;
            data[4] = 8;
            currentFile = new File(parent.last_downloaded_file);
            // convert to byte array
            try (InputStream is = new FileInputStream(currentFile)) {
                if (currentFile.length() > Integer.MAX_VALUE) {
                    mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 1, 0);
                    parent.logMessageDJI("File to big!");
                }

                int byte_offset = 0;
                int bytesRead;
                currentFileInBytes = new byte[(int) currentFile.length()];
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
            long file_size = currentFile.length();
            // Create 8 bytes for the long file size
            byte[] bytes = ByteBuffer.allocate(8).putLong(file_size).array();
            for(int i = 0; i <= 7; i++){
                int added = 12 + i;
                data[i + added] = bytes[i];
            };
            mModel.send_command_ftp_bytes_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, data);
            parent.logMessageDJI("Opened image " + currentFile.getName());
        } else {
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 1, 0);
        }
    }

    public void readFile(int session_id, int offset){
        parent.logMessageDJI("Read file");
        if(currentFile == null || currentFile.length() == 0){
            parent.logMessageDJI("File is null, sending error code");
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 10, 0);
            return;
        }
        parent.logMessageDJI(parent.last_downloaded_file);
        byte[] data = new byte[251];
        data[2] = (byte)session_id;
        parent.logMessageDJI("Offset:  " + offset);

        int payload_data_size = (251-12);
        if(offset > (currentFileInBytes.length/payload_data_size) ){
            mModel.send_command_ftp_nak(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, 6, 0);
            return;
        }
        int startByte = currentFileInBytes.length/payload_data_size * offset;
        int bytes_to_add_size = payload_data_size;
        if(startByte + 251 > currentFileInBytes.length){
            bytes_to_add_size = currentFileInBytes.length - (startByte + 251);
        }
        for(int i = 0; i <= bytes_to_add_size; i++){
            int added = 12 + i;
            data[i + added] = currentFileInBytes[startByte + i];
        };
        parent.logMessageDJI("Sending " + bytes_to_add_size + " bytes using FTP protocol");

        mModel.send_command_ftp_bytes_ack(MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL, data);
    }
}

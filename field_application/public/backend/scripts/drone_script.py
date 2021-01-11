import queue
import threading

from dronekit import connect, VehicleMode, LocationGlobalRelative, LocationGlobal, Command
from pymavlink import mavutil
import time
import re
import math
import os
import io
from PIL import Image
import numpy as np

class DroneEngine(threading.Thread):
    def __init__(self, client, message_que = [], connection_string = ":14450", ftp = False, q = queue.Queue(maxsize=0), loop_time = 1.0/60):
        self.q = q
        self.timeout = loop_time
        self.do_run = True
        self.message_que = message_que
        self.client = client

        # Globals
        self.vehicle = None
        self.connection_string = connection_string
        self.ftp = ftp
        self.getting_fileList = False
        self.getting_file = False
        self.getting_download = False
        self.done_download = False
        self.downloaded = False
        self.size = 0
        self.downloaded_array = []
        self.download_counter = 0
    
        super(DroneEngine, self).__init__()

    def onThread(self, function, *args, **kwargs):
        self.q.put((function, args, kwargs))

    def run(self):
        while self.do_run:
            print("do_run:", str(self.do_run))
            try:
                function, args, kwargs = self.q.get(timeout=self.timeout)
                function(*args, **kwargs)
            except queue.Empty:
                self.idle()

    def idle(self):
        time.sleep(1)
        self.message_que.append([1,2])

    def vehicle_connect(self):
        try:
            self.vehicle.connect(connection_string, wait_ready=True)
        except expression as identifier:
            print("e: " + str(identifier))

    def doSomething(self):
        print("do someting")
        pass
    def doSomethingElse(self):
        print("do someting")
        pass

    def doSomethingReturn(self):
        return "KAAS"

    def set_vehicle_receivers(self, connection_string):
        try:
            self.vehicle.add_message_listener('*', drone_status_receiver)
            self.vehicle.add_message_listener('FILE_TRANSFER_PROTOCOL', ftp_decoder)
        except expression as identifier:
            pass

    #Callback method for new messages
    def drone_status_receiver(self, name, msg):
        if (name != "ATTITUDE" 
        and name != "VIBRATION"
        and name != "ALTITUDE"
        and name != "VFR_HUD"
        and name != "GPS_RAW_INT"
        and name != "RC_CHANNELS"
        and name != "BATTERY_STATUS"
        and name != "HEARTBEAT"
        and name != "RC_CHANNELS"
        and name != "POWER_STATUS"
        and name != "SYS_STATUS"
        and name != "GLOBAL_POSITION_INT"
        and name != "RADIO_STATUS"
        and name != "FILE_TRANSFER_PROTOCOL"):
            print(msg)
            pass

    def ftp_decoder(self, msg):
        global getting_fileList
        global getting_file
        global getting_download
        global done_download
        global size
        global downloaded_array
        global download_counter
        global image_open
        global downloaded
        payload = msg.payload
        # text = ""
        if payload[3] == 128:
            real_payload = bytearray(len(payload)-12)
            list_payload = []

            offset_list = [payload[8],payload[9], payload[10], payload[11]]
            offset_bytes = bytes(offset_list)
            myOffset = int.from_bytes(offset_bytes, "big")

            read_size = payload[4]

            counter = 0
            if(getting_download):
                for i in range(12, (read_size+12)):
                    real_payload[counter] = payload[i]
                    list_payload.append(payload[i])
                    counter = counter + 1
            else:
                for i in range(12, len(payload)):
                    real_payload[counter] = payload[i]
                    list_payload.append(payload[i])
                    counter = counter + 1

            if getting_fileList:
                payload_string = real_payload.decode("utf-8")
                items = payload_string.split("\\0F")
                for item in items:
                    splited_item = item.split("\\t")
                    if(len(splited_item) > 1) and (splited_item not in files):
                        files.append(splited_item)
                    pass
                getting_fileList = False
            if getting_file:
                payload_string = real_payload.decode("utf-8")
                size = payload_string
                size = re.search(r'\d+', size).group()
                getting_file = False
            if done_download == False and getting_download:
                downloaded = myOffset
                downloaded_array[myOffset] = list_payload
        else:
            print("Got a NAK response")

    def download(self):
        global getting_download
        global downloaded_array

        getting_download = True
        packets = int(size) / (251-12)
        packets = math.ceil(packets) - 1
        time.sleep(1)
        downloaded_array = [None] * packets
        to_download = packets
        downloaded_counter = 0
        print(packets)
        while True:
            if(downloaded + 500 < downloaded_counter):
                while downloaded + 150 < downloaded_counter:
                    time.sleep(0.025)
            MAV_download_file(downloaded_counter)
            time.sleep(0.01)
            downloaded_counter = downloaded_counter + 1
            if downloaded_counter == to_download + 1:
                break
        redownload()

    def redownload(self):
        redownload_list = []
        for i in range(len(downloaded_array)):
            if downloaded_array[i] == None:
                redownload_list.append(i)
        if len(redownload_list) > 0:
            for i in range(len(redownload_list)):
                MAV_download_file(redownload_list[i])
                time.sleep(0.0025)
            time.sleep(2)
            redownload()

    def create_image(self, file_name, downloaded_array):
        full_array =[]
        for i in downloaded_array:
                full_array += i
        bytes = bytearray(full_array)
        image = Image.open(io.BytesIO(bytes))
        image.save(file_name)

    # MAV FTP FUNCITONS
    def MAV_get_ftp_list(self, offset = 0):
        payload = bytearray(251)
        # Command = get list
        payload[3] = 3
        # Get offset (for now it's 5)
        offset_bytes = offset.to_bytes(4, 'big')
        payload[8] = offset_bytes[0]
        payload[9] = offset_bytes[1]
        payload[10] = offset_bytes[2]
        payload[11] = offset_bytes[3]

        print("SEND MAVLINK_MSG_ID_FILE_TRANSFER_PROTOCOL")
        msg = self.vehicle.message_factory.file_transfer_protocol_encode(
                0,0,0,payload
            )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()
        time.sleep(2)

    def MAV_download_file(self, offset):
        payload = bytearray(251)
        # Command = download file
        payload[3] = 5
        # Offset
        if(offset != 0):
            offset_bytes = offset.to_bytes(4, 'big')
            payload[8] = offset_bytes[0]
            payload[9] = offset_bytes[1]
            payload[10] = offset_bytes[2]
            payload[11] = offset_bytes[3]
        
        msg = self.vehicle.message_factory.file_transfer_protocol_encode(
                0,0,0,payload
            )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

    def MAV_open_file(self, file_id):
        global size
        global getting_file
        size = 0

        getting_file = True
        payload = bytearray(251)
        # Command = download file
        payload[3] = 4
        payload[12] = file_id
        msg = self.vehicle.message_factory.file_transfer_protocol_encode(
                0,0,0,payload
            )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

        time.sleep(1)

        fail_counter = 0
        while size == 0:
            time.sleep(0.5)
            fail_counter = fail_counter + 1
            if(fail_counter > 50):
                fail_counter = 0
                MAV_open_file(2)

    # MAV IMPORTANT DRONE FUNCTIONS
    # def MAV_upload_waypoints(self):
        # TODO

    # def MAV_pauze(self):
    #     payload = bytearray(251)
    #     msg = self.vehicle.message_factory.file_transfer_protocol_encode(
    #             0,0,0,payload
    #         )
    #     vehicle.send_mavlink(msg)
    #     vehicle.flush()
    #     time.sleep(2)

    # def MAV_resume(self):
    #     # TODO

    # def MAV_go_home(self):
    #     # TODO
        
    # def MAV_start_mission(self):
    #     # TODO

    def stop(self):
        self.do_run = False
        self.client.sendSocketMessage("Stoping drone thread")
        return
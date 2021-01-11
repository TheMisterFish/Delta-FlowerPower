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
    def __init__(self, client, message_que = [], connection_string = ":14450", fly_height = 3, ftp = False, q = queue.Queue(maxsize=0), loop_time = 1.0/60):
        self.q = q
        self.timeout = loop_time
        self.do_run = True
        self.message_que = message_que
        self.client = client

        # Important data
        self.vehicle = None
        self.connection_string = connection_string
        self.ftp = ftp
        self.fly_height = fly_height
        # Globals
        self.getting_fileList = False
        self.getting_file = False
        self.getting_download = False
        self.done_download = True
        self.downloaded = False
        self.size = 0
        self.files = []
        self.init_files = []
        self.downloaded_files = []
        self.downloaded_array = []
        self.download_counter = 0
    
        super(DroneEngine, self).__init__()

    def onThread(self, function, *args, **kwargs):
        self.q.put((function, args, kwargs))

    def run(self):
        while self.do_run:
            print("Drone thread running, do_run:", str(self.do_run))
            try:
                function, args, kwargs = self.q.get(timeout=self.timeout)
                function(*args, **kwargs)
            except queue.Empty:
                self.idle()

    def idle(self):
        time.sleep(1)
        if(self.vehicle != None):
            nextwaypoint=self.vehicle.commands.next
            print('Distance to waypoint (%s): %s' % (nextwaypoint, self.distance_to_current_waypoint()))

    def vehicle_connect(self):
        if(self.vehicle != None):
            self.client.sendSocketMessage("{'error':'vehicle_connect: vehicle was not None'}")
            return
        try:
            self.vehicle.connect(self.connection_string, wait_ready=True)
            self.set_vehicle_receivers()
        except expression as identifier:
            self.client.sendSocketMessage("{'error':'"+str(identifier)+"'}")

    def set_vehicle_receivers(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'set_vehicle_receivers: vehicle is None'}")
            return
        try:
            self.vehicle.add_message_listener('*', self.drone_status_receiver)
            self.vehicle.add_message_listener('FILE_TRANSFER_PROTOCOL', self.ftp_decoder)
        except expression as identifier:
            self.client.sendSocketMessage("{'error':'"+str(identifier)+"'}")

    #Callback method for new messages
    def drone_status_receiver(self, name, msg):
        self.client.sendSocketMessage("{'name':'"+str(name)+"','msg':'"+str(msg)+"'}")

    def ftp_decoder(self, msg):
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
            if(self.getting_download):
                for i in range(12, (read_size+12)):
                    real_payload[counter] = payload[i]
                    list_payload.append(payload[i])
                    counter = counter + 1
            else:
                for i in range(12, len(payload)):
                    real_payload[counter] = payload[i]
                    list_payload.append(payload[i])
                    counter = counter + 1

            if self.getting_fileList:
                payload_string = real_payload.decode("utf-8")
                items = payload_string.split("\\0F")
                for item in items:
                    splited_item = item.split("\\t")
                    if(len(splited_item) > 1) and (splited_item not in self.files):
                        self.files.append(splited_item)
                    pass
                self.getting_fileList = False
            if self.getting_file:
                payload_string = real_payload.decode("utf-8")
                self.size = payload_string
                self.size = re.search(r'\d+', self.size).group()
                self.getting_file = False
            if self.done_download == False and self.getting_download:
                self.downloaded = myOffset
                self.downloaded_array[myOffset] = list_payload
        else:
            self.client.sendSocketMessage("{'error':'Received a NAK message'}")

    def download(self):
        self.getting_download = True
        packets = int(size) / (251-12)
        packets = math.ceil(packets) - 1
        time.sleep(1)
        self.downloaded_array = [None] * packets
        to_download = packets
        downloaded_counter = 0
        while True:
            if(downloaded + 500 < downloaded_counter):
                while downloaded + 150 < downloaded_counter:
                    time.sleep(0.025)
            self.MAV_download_file(downloaded_counter)
            time.sleep(0.01)
            downloaded_counter = downloaded_counter + 1
            if downloaded_counter == to_download + 1:
                break
        self.redownload()

    def redownload(self):
        redownload_list = []
        for i in range(len(self.downloaded_array)):
            if self.downloaded_array[i] == None:
                redownload_list.append(i)
        if len(redownload_list) > 0:
            for i in range(len(redownload_list)):
                self.MAV_download_file(redownload_list[i])
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
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_get_ftp_list: vehicle is None'}")
            return
        payload = bytearray(251)
        # Command = get list
        payload[3] = 3
        # Get offset (for now it's 5)
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
        time.sleep(2)

    def MAV_download_file(self, offset):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_download_file: vehicle is None'}")
            return
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
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_open_file: vehicle is None'}")
            return
        self.size = 0

        self.getting_file = True
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
                self.MAV_open_file(2)

    def MAV_pauze(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_pauze: vehicle is None'}")
            return
        msg = self.vehicle.message_factory.command_long_encode(
            0, 0,    # target system, target component
            mavutil.mavlink.MAV_CMD_OVERRIDE_GOTO, #command
            0, #confirmation
            mavutil.mavlink.MAV_GOTO_DO_HOLD, 0, 0, 0, 0, 0, 0 #params 1-7
        )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

    def MAV_resume(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_resume: vehicle is None'}")
            return
        msg = self.vehicle.message_factory.command_long_encode(
            0, 0,    # target system, target component
            mavutil.mavlink.MAV_CMD_MISSION_START  , #command
            0, #confirmation
            0,0,0,0,0,0,0 #params 1-7
        )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

    def MAV_return_to_launch(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_return_to_launch: vehicle is None'}")
            return
        msg = self.vehicle.message_factory.command_long_encode(
            0, 0,    # target system, target component
            mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, #command
            0, #confirmation
            0, 0, 0, 0, 0, 0, 0 #params 1-7
        )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

    def MAV_land(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_land: vehicle is None'}")
            return
        msg = self.vehicle.message_factory.command_long_encode(
            0, 0,    # target system, target component
            mavutil.mavlink.MAV_CMD_NAV_LAND, #command
            0, #confirmation
            0, 0, 0, 0, 0, 0, 0 #params 1-7
        )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()
        
    def MAV_start_mission(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_start_mission: vehicle is None'}")
            return
        msg = self.vehicle.message_factory.command_long_encode(
            0, 0,    # target system, target component
            mavutil.mavlink.MAV_CMD_MISSION_START  , #command
            0, #confirmation
            0,0,0,0,0,0,0 #params 1-7
        )
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

    def MAV_set_gimbal(self, servo, val):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_set_gimbal: vehicle is None'}")
            return
        msg = self.vehicle.message_factory.command_long_encode(
            0, # time_boot_ms (not used)
            0,  # target system, target component
            mavutil.mavlink.MAV_CMD_DO_SET_SERVO, 
            0, 
            servo, # RC channel...
            1500+(val*5.5), # RC value
            0, 0, 0, 0, 0)
        self.vehicle.send_mavlink(msg)
        self.vehicle.flush()

    def MAV_clear_mission(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_clear_mission: vehicle is None'}")
            return
        cmds = self.vehicle.commands
        cmds.download()
        cmds.wait_ready()
        cmds.clear() 

    def MAV_takeoff(self, alt):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_takeoff: vehicle is None'}")
            return
        self.vehicle.simple_takeoff(alt)
    
    def MAV_gethome(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_gethome: vehicle is None'}")
            return
        while not self.vehicle.home_location:
            self.vehicle.commands.download()
            self.vehicle.commands.wait_ready()
            time.sleep(0.2)

    # MAV IMPORTANT DRONE FUNCTIONS
    def MAV_upload_waypoints(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'MAV_upload_waypoints: vehicle is None'}")
            return


    # GETTER FUNCITONS FOR INFO
    def get_location_metres(self, original_location, dNorth, dEast):
        earth_radius=6378137.0 #Radius of "spherical" earth
        #Coordinate offsets in radians
        dLat = dNorth/earth_radius
        dLon = dEast/(earth_radius*math.cos(math.pi*original_location.lat/180))

        #New position in decimal degrees
        newlat = original_location.lat + (dLat * 180/math.pi)
        newlon = original_location.lon + (dLon * 180/math.pi)
        return LocationGlobal(newlat, newlon,original_location.alt)

    def get_distance_metres(self, aLocation1, aLocation2):
        dlat = aLocation2.lat - aLocation1.lat
        dlong = aLocation2.lon - aLocation1.lon
        return math.sqrt((dlat*dlat) + (dlong*dlong)) * 1.113195e5

    def distance_to_current_waypoint(self):
        nextwaypoint = self.vehicle.commands.next
        if nextwaypoint==0:
            return None
        missionitem = self.vehicle.commands[nextwaypoint-1] #commands are zero indexed
        lat = missionitem.x
        lon = missionitem.y
        alt = missionitem.z
        targetWaypointLocation = LocationGlobalRelative(lat,lon,alt)
        distancetopoint = self.get_distance_metres(vehicle.location.global_frame, targetWaypointLocation)
        return distancetopoint

    # DOWNLOAD
    def getFileList(self):
        self.getting_fileList = True
        self.MAV_get_ftp_list()
        time.sleep(2)
        while True:
            lastLen = self.files.len()
            self.MAV_get_ftp_list(lastLen)
            while self.getting_fileList:
                time.sleep(0.2)
            if self.files.len() == lastLen:
                break
        self.client.sendSocketMessage("{'info':'get_file_list: Got all files.'}")

    def initFileList(self):
        self.get_file_list()
        self.init_files = self.files
        
    def downloadUnknownFiles(self):
        for i, file in self.files:
            if file not in self.init_files:
                self.downloadFile(i)

    def downloadFile(self, file_id):
        if(self.done_download):
            self.client.sendSocketMessage("{'error':'download_file: Download still in progress'}")
            return
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'downloadFile: vehicle is None'}")
            return
        try:
            file_name = self.files[file_id]
        except expression as identifier:
            self.client.sendSocketMessage("{'error':'"+str(identifier)+"'}")
            return
        self.done_download = False
        self.MAV_open_file(i)
        self.download()
        self.create_image(str(file_name), downloaded_array)
        self.downloaded_files.append(file_name)
        self.done_download = True
        self.downloaded_array = []

    def goHome(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'goHome: vehicle is None'}")
            return
        self.MAV_pauze()
        self.MAV_clear_mission()
        self.MAV_return_to_launch()

    def doLand(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'doLand: vehicle is None'}")
            return
        self.MAV_pauze()
        self.MAV_land()

    def doPauze(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'doPauze: vehicle is None'}")
            return
        self.MAV_pauze()

    def doResume(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'doResume: vehicle is None'}")
            return
        self.MAV_resume()

    def aimGimbal(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'aimGimbal: vehicle is None'}")
            return
        self.MAV_set_gimbal(0, -90)
    
    def homeGimbal(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'homeGimbal: vehicle is None'}")
            return
        self.MAV_set_gimbal(0, 0)
    
    def doStartMission(self):
        if(self.vehicle == None):
            self.client.sendSocketMessage("{'error':'homeGimbal: vehicle is None'}")
            return
        self.MAV_start_mission()
    
    def addWaypoints(self, waypoints):
        print("GOT WAYPOINTS:")
        print(waypoints)
    # STOP
    def emergency_stop(self):
        if(self.vehicle == None):
            self.stop()
            return
        self.MAV_pauze()
        self.MAV_clear_mission()
        self.MAV_return_to_launch()
        time.sleep(4)
        self.MAV_land()
        self.stop()

    def stop(self):
        self.do_run = False
        self.client.sendSocketMessage("{'info':'Stoping drone thread'}")
        return
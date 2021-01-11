from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory
from socket_message import socket_message
from twisted.internet import reactor
from twisted.python import log
from scripts.yolov5.simple_detect import detect
from scripts.splitter import split_images
import scripts.drone_script

import threading
import json
import sys
import os
import shutil

log.startLogging(sys.stdout)

BASE_PATH = os.getcwd()
TEMP_PATH = os.path.join(BASE_PATH, "temp")

DroneEngine = None

def start_drone_script(client, connection_string, ftp, fly_height):
    global DroneEngine
    client.sendSocketMessage("DRONEINFO", "{'info':'Starting drone thread'}")
    DroneEngine = scripts.drone_script.DroneEngine(client=client, connection_string=connection_string, fly_height=fly_height, ftp=ftp)
    DroneEngine.start()

def safe_stop_drone_script(client):
    global DroneEngine
    client.sendSocketMessage("DRONEINFO", "{'info':'(Safe) Stoping drone thread'}")
    DroneEngine.onThread(DroneEngine.emergency_stop)

def stop_drone_script(client):
    global DroneEngine
    client.sendSocketMessage("DRONEINFO", "{'info':'Stoping drone thread'}")
    DroneEngine.onThread(DroneEngine.stop)

def send_drone_message(client, msg, data):
    global DroneEngine
    if(msg == "vehicle_connect"):
        client.sendSocketMessage("DRONEINFO", "{'info':'Drone connecting'}")
        DroneEngine.onThread(DroneEngine.vehicle_connect)
        time.sleep(2)
        client.sendSocketMessage("DRONEINFO", "{'info':'Drone getting files from SD'}")
        DroneEngine.onThread(DroneEngine.initFileList)
        time.sleep(2)
        client.sendSocketMessage("DRONECONNECTED", "{}")

    elif(msg == "downloadFile"):
        file_id = data[0]
        file_name = data[1]
        DroneEngine.onThread(DroneEngine.downloadFile(file_id, file_name))
    elif(msg == "downloadUnknownFiles"):
        DroneEngine.onThread(DroneEngine.downloadUnknownFiles())
    elif(msg == "getFileList"):
        DroneEngine.onThread(DroneEngine.getFileList)
    elif(msg == "initFileList"):
        DroneEngine.onThread(DroneEngine.initFileList)
    elif(msg == "goHome"):
        DroneEngine.onThread(DroneEngine.goHome)
    elif(msg == "doLand"):
        DroneEngine.onThread(DroneEngine.doLand)
    elif(msg == "aimGimbal"):
        DroneEngine.onThread(DroneEngine.aimGimbal)
    elif(msg == "homeGimbal"):
        DroneEngine.onThread(DroneEngine.homeGimbal)
    elif(msg == "doPauze"):
        DroneEngine.onThread(DroneEngine.doPauze)
    elif(msg == "doResume"):
        DroneEngine.onThread(DroneEngine.doResume)
    elif(msg == "doStartMission"):
        DroneEngine.onThread(DroneEngine.doStartMission)
    elif(msg == "addWaypoints"):
        waypoints = data[0]
        DroneEngine.onThread(DroneEngine.addWaypoints(waypoints))

#TODO In the temp folder generate a subfolder for each image instead of putting everything in the root
#That way we can trace back the original file name (which is the name of the subfolder)
def simple_detect_action(client, weights_directory, input_directory, confidence, image_size):
    client.sendSocketMessage("Splitting images")

    if not os.path.exists(TEMP_PATH):
        os.makedirs(TEMP_PATH)
    else:
        shutil.rmtree(TEMP_PATH)
        os.makedirs(TEMP_PATH)

    split_images(input_directory, TEMP_PATH, image_size)

    client.sendSocketMessage("Executing simple detect script")
    thread = threading.Thread(target=detect, args=(
        client, weights_directory, image_size, confidence, TEMP_PATH))
    thread.start()
    thread.join()
    client.sendSocketMessage("Finished simple detect script")

    shutil.rmtree(TEMP_PATH)


class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer), flush=True)

    def onOpen(self):
        print("WebSocket connection open.")

    def sendSocketMessage(self, message, data=None):
        self.sendMessage(str.encode(json.dumps(socket_message(message, data).__dict__)))

    def onMessage(self, payload, isBinary):
        self.sendSocketMessage("RECEIVED PAYLOAD!")
        message = json.loads(payload)
        if message[0] == "DETECT_IMAGES":
            thread = threading.Thread(
                target=simple_detect_action, args=(self, message[1], message[2], float(message[3]), int(float(message[4])))).start()
        if message[0] == "DRONE_INIT":
            connection_string = message[1]
            ftp = message[2]
            fly_height = message[3]
            thread = threading.Thread(
                target=start_drone_script, args=[self, connection_string, ftp, fly_height]).start()
        if message[0] == "DRONE_EMERGENCY_STOP":
            thread = threading.Thread(
                target=safe_stop_drone_script, args=[self]).start()
        if message[0] == "DRONE_STOP":
            thread = threading.Thread(
                target=safe_stop_drone_script, args=[self]).start()
        if message[0] == "DRONE_MESSAGE":
            msg = message[1]
            data = message[2]
            thread = threading.Thread(
                target=send_drone_message, args=[self, msg, data]).start()

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason), flush=True)


if __name__ == '__main__':
    factory = WebSocketServerFactory("ws://127.0.0.1:9000")
    factory.protocol = MyServerProtocol

    reactor.listenTCP(9000, factory)
    reactor.run()

from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory
from socket_message import socket_message
from twisted.internet import reactor
from twisted.python import log
from scripts.yolov5.simple_detect import detect
from scripts.splitter import split_images
import threading
import json
import sys
import os
import shutil

log.startLogging(sys.stdout)

BASE_PATH = os.getcwd()
TEMP_PATH = os.path.join(BASE_PATH, "temp")

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

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason), flush=True)


if __name__ == '__main__':
    factory = WebSocketServerFactory("ws://127.0.0.1:9000")
    factory.protocol = MyServerProtocol

    reactor.listenTCP(9000, factory)
    reactor.run()

from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory
from socket_message import socket_message
from twisted.internet import reactor
from twisted.python import log
from scripts.yolov5 import simple_detect
import threading
import random
import json
import sys

log.startLogging(sys.stdout)


def simple_detect_action(client, weights_directory, input_directory):
    client.sendSocketMessage("Executing simple detect script")
    thread = threading.Thread(target=simple_detect.detect, args=(
        client, weights_directory, 512, 0.1, input_directory))
    thread.start()
    thread.join()
    client.sendSocketMessage("Finished simple detect script")


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
                target=simple_detect_action, args=(self, message[1], message[2])).start()

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason), flush=True)


if __name__ == '__main__':
    factory = WebSocketServerFactory("ws://127.0.0.1:9000")
    factory.protocol = MyServerProtocol

    reactor.listenTCP(9000, factory)
    reactor.run()

from autobahn.twisted.websocket import WebSocketServerProtocol
from autobahn.twisted.websocket import WebSocketServerFactory
from twisted.internet import reactor
from twisted.python import log
from scripts import splitter
import threading
import random
import json
import sys

log.startLogging(sys.stdout)


def split_images(self, input_directory, output_directory):
    #Sending opening script message
    self.sendSocketMessage("Opening script...")
    #Execute the splitter script on a new thread, this way we can wait for the thread to be finished (thread.join())
    thread = threading.Thread(target=splitter.split_images, args=(self, input_directory, output_directory, 512, 512))
    thread.start()
    thread.join()
    #At the end of the script send the finished message
    self.sendSocketMessage("Finished succesfully!")


class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer), flush=True)

    def onOpen(self):
        print("WebSocket connection open.")

    def sendSocketMessage(self, message):
        self.sendMessage(str.encode(message))

    def onMessage(self, payload, isBinary):
        print(payload, flush=True)
        message = json.loads(payload)
        self.sendSocketMessage("Received payload!")
        if message[0] == "SPLIT_IMAGES":
            thread = threading.Thread(target=split_images, args=(
                self, message[1], message[2])).start()

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason), flush=True)


if __name__ == '__main__':
    # WebSocketServerFactory.resetProtocolOptions()
    factory = WebSocketServerFactory("ws://127.0.0.1:9000")
    factory.protocol = MyServerProtocol

    reactor.listenTCP(9000, factory)
    reactor.run()

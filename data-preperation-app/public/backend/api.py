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
    self.sendMessage(str.encode("Opening script..."),
                     fragmentSize=len(str.encode("Opening script...")))
    splitter.split_images(self, input_directory, output_directory, 512, 512)


class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer), flush=True)

    def onOpen(self):
        print("WebSocket connection open.")

    def onMessage(self, payload, isBinary):
        print(payload, flush=True)
        message = json.loads(payload)
        self.sendMessage(str.encode("Received payload!"), fragmentSize=len(
            str.encode("Received payload!")), sync=False)
        if message[0] == "SPLIT_IMAGES":
            thread = threading.Thread(target=split_images,args=(self, message[1], message[2])).start()

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason), flush=True)


if __name__ == '__main__':
    # WebSocketServerFactory.resetProtocolOptions()
    factory = WebSocketServerFactory("ws://127.0.0.1:9000")
    factory.protocol = MyServerProtocol

    reactor.listenTCP(9000, factory)
    reactor.run()

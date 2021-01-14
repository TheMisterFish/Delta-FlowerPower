import numpy
import torch
import cv2
import os
from socket_message import socket_message

def detect(client, weights, img_size, confidence, source):
    model = torch.hub.load('ultralytics/yolov5', 'custom', path_or_model=weights)

    for file in os.listdir(source):
        image = cv2.imread(os.path.join(source, file))[:, :, ::-1]

        results = model(image, size=img_size)

        bounding_boxes = []

        file_name = os.path.basename(file).split("#")[0]
        file_position_x = int(file.split("#")[1].split("_")[0])
        file_position_y = int(file.split("#")[1].split("_")[1])
        offset_x = file_position_x * img_size
        offset_y = file_position_y * img_size

        for result in results.xyxy[0]:
            bounding_box = calcBox(result[0].numpy(), result[1].numpy(), result[2].numpy(), result[3].numpy(), img_size, img_size, offset_x, offset_y)
            bounding_boxes.append(bounding_box)
        
        if len(bounding_boxes) > 0:
            client.sendSocketMessage("BOUNDING_BOXES", {"image": file_name, "boundingBoxes": bounding_boxes})
    client.sendSocketMessage("DETECTION_FINISHED")
        
def calcBox(x, y, w, h, width, height, offset_x, offset_y):
    return {"x1": int(x+offset_x), "y1": int(y+offset_y), "x2": int(w+offset_x), "y2": int(h+offset_y)}
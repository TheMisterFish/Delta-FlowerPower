import numpy
import cv2

import time
from pathlib import Path

import sys
import os
from socket_message import socket_message

import torch
import torch.backends.cudnn as cudnn

# Without the following code, torch will crash
def script_method(fn, _rcb=None):
    return fn
def script(obj, optimize=True, _frames_up=0, _rcb=None):
    return obj    
import torch.jit
torch.jit.script_method = script_method 
torch.jit.script = script

from . import models
from . import utils

def detect(client, weights, img_size, confidence, source):
    client.sendSocketMessage("Inside the detec function")
    source, weights, imgsz = source, weights, img_size
    # Initialize
    set_logging()
    device = select_device('')
    half = device.type != 'cpu'  # half precision only supported on CUDA

    # Load model
    model = attempt_load(weights, map_location=device)  # load FP32 model
    imgsz = check_img_size(imgsz, s=model.stride.max())  # check img_size
    if half:
        model.half()  # to FP16

    # Second-stage classifier
    classify = False
    if classify:
        modelc = load_classifier(name='resnet101', n=2)  # initialize
        modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device)['model']).to(device).eval()

    # Set Dataloader
    vid_path, vid_writer = None, None

    dataset = LoadImages(source, img_size=imgsz)

    client.sendSocketMessage("Loaded the dataset!")

    # Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names

    client.sendSocketMessage("Loaded the names")

    # Run inference
    t0 = time.time()
    img = torch.zeros((1, 3, imgsz, imgsz), device=device)  # init img
    _ = model(img.half() if half else img) if device.type != 'cpu' else None  # run once
    for path, img, im0s, _ in dataset:
        client.sendSocketMessage("Handling image", path)
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=None)[0]

        # Apply NMS
        pred = non_max_suppression(pred, confidence, 0.45, classes=None, agnostic=None)
        t2 = time_synchronized()

        # Apply Classifier
        if classify:
            pred = apply_classifier(pred, modelc, img, im0s)

        file_path = path
        file_name = os.path.basename(file_path).split("#")[0]
        file_position_x = int(file_path.split("#")[1].split("_")[0])
        file_position_y = int(file_path.split("#")[1].split("_")[1])
        offset_x = file_position_x * img_size
        offset_y = file_position_y * img_size
        bounding_boxes = []

        # Process detections
        for i, det in enumerate(pred):  # detections per image
            p, s, im0 = Path(path), '', im0s

            s += '%gx%g ' % img.shape[2:]  # print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            if det is not None and len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += '%g %ss, ' % (n, names[int(c)])  # add to string

                # Write results
                for *xyxy, conf, cls in reversed(det):
                    xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
                    bounding_box = calcBox(xywh, imgsz, imgsz, offset_x, offset_y)

                    bounding_boxes.append(bounding_box)

            # Print time (inference + NMS)
            print('%sDone. (%.3fs)' % (s, t2 - t1))
        
        if len(bounding_boxes) > 0:
            client.sendSocketMessage("BOUNDING_BOXES", {"image": file_name, "boundingBoxes": bounding_boxes})

    print('Done. (%.3fs)' % (time.time() - t0))

def calcBox(xywh, width, height, offset_x, offset_y):
    dh,dw = width,height
    x, y, w, h = map(float, xywh)

    l = int((x - w / 2) * dw)
    r = int((x + w / 2) * dw)
    t = int((y - h / 2) * dh)
    b = int((y + h / 2) * dh)
    
    if l < 0:
        l = 0
    if r > dw - 1:
        r = dw - 1
    if t < 0:
        t = 0
    if b > dh - 1:
        b = dh - 1

    # Return Top, Left - Bottom, Right
    return {"x1": str(l+offset_x), "y1": str(t+offset_y), "x2": str(r+offset_x), "y2": str(b+offset_y)}


# if __name__ == '__main__':
#     detect('./weights/yolov5_best.pt', 416, 0.1, './testimgs')

# def test():
#     detect('./weights/yolov5_best.pt', 416, 0.1, './testimgs')
#     return "It worked!"
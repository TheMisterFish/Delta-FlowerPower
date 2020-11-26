import argparse
import time
from pathlib import Path
import cv2
from numpy import random
import sys

sys.path.insert(0, './public/backend/scripts/yolov5')

import torch
import torch.backends.cudnn as cudnn

from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, non_max_suppression, apply_classifier, scale_coords, xyxy2xywh, \
    strip_optimizer, set_logging, increment_path
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized


def detect(client, weights, img_size, conf, source):
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
        client.sendSocketMessage("Handling image path: " + path)
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=None)[0]

        # Apply NMS
        pred = non_max_suppression(pred, conf, 0.45, classes=None, agnostic=None)
        t2 = time_synchronized()

        # Apply Classifier
        if classify:
            pred = apply_classifier(pred, modelc, img, im0s)

        # Process detections
        for i, det in enumerate(pred):  # detections per image
            print(Path(path))
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
                    print(calcBox(xywh, imgsz, imgsz))

            # Print time (inference + NMS)
            print('%sDone. (%.3fs)' % (s, t2 - t1))

    print('Done. (%.3fs)' % (time.time() - t0))

def calcBox(xywh, width, height):
    dh,dw = width,height
    x, y, w, h = map(float, xywh)
    print(x,y,w,h)

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
    return (t,l),(b,r)


# if __name__ == '__main__':
#     detect('./weights/yolov5_best.pt', 416, 0.1, './testimgs')

# def test():
#     detect('./weights/yolov5_best.pt', 416, 0.1, './testimgs')
#     return "It worked!"
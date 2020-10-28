import sys
import argparse
import cv2
from PIL import Image
import numpy as np

# options
VIDEONAME = './test.mp4'
RESULTNAME = './result1.jpg'
BLURTRESH = -0.1
FRAMESKIP = 15

def getFrames():
    frames = []
    blur = []
    vidcap = cv2.VideoCapture(VIDEONAME)
    success,image = vidcap.read()
    while success:
        success, image = vidcap.read()
        if(success):
            curFrame = []
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            fm = cv2.Laplacian(gray, cv2.CV_64F).var()
            blur.append(fm)
            frames.append(image)
    return frames, blur

print("[INFO] Getting frames...")
images = []
frames, blur = getFrames()
avarage = sum(blur)/ len(blur)
lastFrame = 0
for i in range(len(frames)):
    if(blur[i] > (avarage + (avarage * BLURTRESH)) and lastFrame + FRAMESKIP <= i):
        img = Image.fromarray(frames[i], 'RGB')
        images.append(frames[i])
        lastFrame = i

print("[INFO] Stitching images... (images:" + str(len(images)) + ")")
stitcher = cv2.Stitcher_create(1)

(status, stitched) = stitcher.stitch(images)

if status != 0:
    print("[ERR] Can't stitch images, error code = %d" % status)
    sys.exit(-1)

print("[INFO] Writing new image...")
cv2.imwrite(RESULTNAME, stitched)
print("[INFO] Done")
import sys
import argparse
import cv2
from PIL import Image
import numpy as np

def getFrames():
    frames = []
    vidcap = cv2.VideoCapture('./test4.mp4')
    success,image = vidcap.read()
    fps = int(round(vidcap.get(cv2.CAP_PROP_FPS) / 4)) #  Gets the frames per second
    counter = 0
    lastFrame = 0
    total = 0
    avg_counter = 0
    while success:
        success, image = vidcap.read()
        if(success):
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            fm = cv2.Laplacian(gray, cv2.CV_64F).var()
            total = total + fm
            avg_counter = avg_counter + 1

    vidcap = cv2.VideoCapture('./test4.mp4')
    success,image = vidcap.read()
    while success:
        counter = counter + 1
        frameId = int(round(vidcap.get(1))) #current frame number, rounded b/c sometimes you get frame intervals which aren't integers...this adds a little imprecision but is likely good enough
        success, image = vidcap.read()
        if(success):
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            fm = cv2.Laplacian(gray, cv2.CV_64F).var()
            if(fm > (total/(avg_counter + (avg_counter *0.1))) and lastFrame + 4 < counter):
                lastFrame = counter
                print("added " + str(frameId))
                frames.append(image)

    vidcap.release()
    return frames

print("[INFO] Getting frames...")
images = []
for frame in getFrames():
    img = Image.fromarray(frame, 'RGB')
    images.append(frame)

# img.show()
print("[INFO] Stitching images...")
stitcher = cv2.Stitcher_create(1)

(status, stitched) = stitcher.stitch(images)

if status != 0:
    print("[ERR] Can't stitch images, error code = %d" % status)
    sys.exit(-1)

print("[INFO] Writing new image...")
cv2.imwrite("./rcaefwa.jpg", stitched)
print("[INFO] Done")
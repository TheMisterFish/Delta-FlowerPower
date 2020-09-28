import sys
import argparse
import cv2
from PIL import Image
import numpy as np

# options
VIDEONAME = './test.mp4'
RESULTNAME = './result1_test3.jpg'
BLURTRESH = -0.1
FRAMESKIP = 15

def getFrames():
    frames = []
    cur_img = []
    counter = 0
    lastFrame = 0
    vidcap = cv2.VideoCapture(VIDEONAME)
    success,image = vidcap.read()
    old_image = None
    while success:
        success, image = vidcap.read()
        if(success):
            old_image = image
            w,h = tuple(image.shape[1::-1])
            left = image[0:0+h, 0:0+int(w / 100 * 5)]
            right = image[0:0+h, w-int(w / 100 * 5):0+w]
            top = image[h - int(h / 100 * 5):0+h, 0:0+w]
            bottom = image[0:0+int(h / 100 * 5), 0:0+w]

            if (counter == 0):
                cur_img.append(left)
                cur_img.append(right)
                cur_img.append(top)
                cur_img.append(bottom)
                frames.append(image)
            elif(lastFrame + 10 <= counter):
                resL = cv2.absdiff(left, cur_img[1]).astype(np.uint8)
                resR = cv2.absdiff(right, cur_img[0]).astype(np.uint8)
                resT = cv2.absdiff(top, cur_img[3]).astype(np.uint8)
                resB = cv2.absdiff(bottom, cur_img[2]).astype(np.uint8)

                percentageL = (np.count_nonzero(resL) * 100)/ resL.size
                percentageR = (np.count_nonzero(resR) * 100)/ resR.size
                percentageT = (np.count_nonzero(resT) * 100)/ resT.size
                percentageB = (np.count_nonzero(resB) * 100)/ resB.size
                print(percentageL, percentageR, percentageT, percentageB)
                if(percentageL >= 99.25 or percentageR >= 99.25 or percentageT >= 99.25 or percentageB >= 99.25):
                    cur_img[0] = left
                    cur_img[1] = right
                    cur_img[2] = top
                    cur_img[3] = bottom
                    frames.append(image)
                    print("found " + str(len(frames)))
                    lastFrame = counter
            
            counter = counter + 1

    return frames

print("[INFO] Getting frames...")
images = []

for frame in getFrames():
    img = Image.fromarray(frame, 'RGB')
    images.append(frame)

print("[INFO] Stitching images... (images:" + str(len(images)) + ")")
stitcher = cv2.Stitcher_create(1)

(status, stitched) = stitcher.stitch(images)

if status != 0:
    print("[ERR] Can't stitch images, error code = %d" % status)
    sys.exit(-1)

print("[INFO] Writing new image...")
cv2.imwrite(RESULTNAME, stitched)
print("[INFO] Done")
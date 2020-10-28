import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image
import csv


MAX_WIDTH = 416
MAX_HEIGHT = 416
def isIn(x1, y1, x2, y2, px, py):
    return px >= x1 and px <= x2 and py >= y1 and py <= y2

images = []
allData = []
counter = 0
second_counter = 0

f = open('labels_flowerpower_20200923035405.csv')
lines = f.read().splitlines()
f.close()

for line in lines:
    if(len(line) > 0):
        image_name = line.split(',')[5]
        allData.append(line.split(','))
        if not image_name in images:
            images.append(image_name)

for image_name in images:
    second_counter = second_counter + 1 
    print("Doing "  + str(second_counter) + "/" + str(len(images)))
    
    im = Image.open('images/'+str(image_name))
    # Get w/h & divider numbers
    width, height = im.size
    w_divider = round(width/MAX_WIDTH)
    h_divider = round(height/MAX_HEIGHT)
    plt.axis('off')
    plt.ioff()
    counter = 0
    for h_d in range(h_divider):
        # print(h_d)
        for w_d in range(w_divider):
            regio = (float(w_d * MAX_WIDTH), float(h_d * MAX_HEIGHT), float(w_d * MAX_WIDTH + MAX_WIDTH), float(h_d * MAX_HEIGHT + MAX_HEIGHT))
            show = False
            # ax = plt.gca()
            this_image_points = []
            for data in allData:
                if(data[5] == image_name):
                    px = float(data[1])
                    py = float(data[2])
                    p2x = float(data[1]) + float(data[3])
                    p2y = float(data[2]) + float(data[4])
                    if(isIn(regio[0], regio[1], regio[2], regio[3], px, py) and isIn(regio[0], regio[1], regio[2], regio[3], p2x, p2y)):
                        show = True
                        allData.remove(data) 
                        this_image_points.append([float(data[1])-regio[0],float(data[2])-regio[1],float(data[3]),float(data[4])])
                        # rect = Rectangle((float(data[1])-regio[0],float(data[2])-regio[1]),float(data[3]),float(data[4]),linewidth=1,edgecolor='r',facecolor='none')
                        # ax.add_patch(rect)
            cropped_img = im.crop(regio)
            if(show):
                # Save image
                plt.axis('off')
                # plt.pause(1e-13)
                plt.imshow(cropped_img)
                plt.savefig("new_images/" + image_name[:-4] + "_" + str(counter) + ".JPG",bbox_inches='tight',transparent=True, pad_inches=0)
                plt.close()
                for cords in this_image_points:
                    newTXT = open("new_txt/" + image_name[:-4] + "_" + str(counter) + ".txt","a")
                    string = "0 "
                    string = string + str(round(((cords[0] + cords[2] / 2) / MAX_WIDTH), 6)) + " "
                    string = string + str(round((cords[1] + cords[3] / 2) / MAX_HEIGHT ,6)) + " "
                    string = string + str(round((cords[2] / MAX_WIDTH), 6)) + " "
                    string = string + str(round((cords[3] / MAX_HEIGHT), 6))
                    newTXT.write(string + "\n") 
                    newTXT.close() 
                # print(this_image_points)
                # plt.imshow(cropped_img)
                # plt.show()
                counter = counter + 1

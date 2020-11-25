from dronekit import connect, VehicleMode, LocationGlobalRelative
from pymavlink import mavutil
import time


def fly_and_land(client):
    vehicle = connect('tcp:127.0.0.1:5760', wait_ready=True)

    client.sendSocketMessage("Basic pre-arm checks")

    while not vehicle.is_armable:
        client.sendSocketMessage("Waiting for vehicle to initialise...")
        time.sleep(1)
    
    client.sendSocketMessage("Arming motors")
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    while not vehicle.armed:
        client.sendSocketMessage("Waiting for arming...")
        time.sleep(1) 
    
    client.sendSocketMessage("Taking off!")
    vehicle.simple_takeoff(1)

  # Check that vehicle has reached takeoff altitude
  while True:
    print " Altitude: ", vehicle.location.global_relative_frame.alt 
    # Break and return from function just below target altitude.        
    if vehicle.location.global_relative_frame.alt>=aTargetAltitude*0.95: 
      print "Reached target altitude"
      break
    time.sleep(1)
print("Take off complete")

# Hover for 10 seconds
time.sleep(10)

print("Now let's land")
vehicle.mode = VehicleMode("LAND")

# Close vehicle object
vehicle.close()

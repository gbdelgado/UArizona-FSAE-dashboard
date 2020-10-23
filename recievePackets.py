import socket
import tkinter as tk
import sys
from f1_2019_telemetry.packets import unpack_udp_packet

udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
udp_socket.bind(('', 20777))

HEIGHT = 800
WIDTH = 800



udp_packet = udp_socket.recv(2048)
while udp_packet:
    packet = unpack_udp_packet(udp_packet)
    if(packet.__str__().startswith("PacketCarTelemetryData_V1")):

        rpm = packet.carTelemetryData[0].engineRPM
        speed = packet.carTelemetryData[0].speed
        gear = packet.carTelemetryData[0].gear

        telemetry = "\rRPM: {}, Speed: {}, Gear: {} ".format(rpm, speed, gear)
        sys.stdout.write(telemetry)
        sys.stdout.flush()
        
    udp_packet = udp_socket.recv(2048)


exit(0)
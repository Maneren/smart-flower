from flask import Flask
import RPi.GPIO as GPIO
import time
from flask_cors import CORS

m1 = 21
m2 = 20
m3 = 16
led = 1
uv = 7

sm1 = 0
sm2 = 0
sm3 = 0
sled = 0
suv = 0
GPIO.setmode(GPIO.BCM)
GPIO.setup(m1, GPIO.OUT)
GPIO.setup(m2, GPIO.OUT)
GPIO.setup(m3, GPIO.OUT)
GPIO.setup(led, GPIO.OUT)
GPIO.setup(uv, GPIO.OUT)
app = Flask("smart-flower-server")
CORS(app) # This will enable CORS for all routes

@app.route("/")
def hello():
    return "Hello"

@app.route("/water")
def water():
    print("Watering...")
    if (sm1 == 0):
        sm1 = 1
        GPIO.output(m1, GPIO.HIGH)
    else:
        sm1 = 0
        GPIO.output(m1, GPIO.LOW)

    return "OK"

@app.route("/mist")
def mist():
    print("Misting...")
    if (sm2 == 0):
        sm2 = 1
        GPIO.output(m2, GPIO.HIGH)
    else:
        sm2 = 0
        GPIO.output(m2, GPIO.LOW)
    return "OK"

@app.route("/led")
def led():
    print("Toggling LED...")
    if (sled == 0):
        sled = 1
        GPIO.output(led, GPIO.HIGH)
    else:
        sled = 0
        GPIO.output(led, GPIO.LOW)
    return "OK"

@app.route("/uv")
def uv():
    print("Toggling UV...")
    if (suv == 0):
        suv = 1
        GPIO.output(uv, GPIO.HIGH)
    else:
        suv = 0
        GPIO.output(uv, GPIO.LOW)
    return "OK"

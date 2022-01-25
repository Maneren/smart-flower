from flask import Flask

from flask_cors import CORS
app = Flask("smart-flower-server")
CORS(app) # This will enable CORS for all routes

@app.route("/")
def hello():
    return "Hello"

@app.route("/water")
def water():
    print("Watering...")
    # water the plant
    return "OK"

@app.route("/mist")
def mist():
    print("Misting...")
    # mist the plant
    return "OK"

@app.route("/led")
def led():
    print("Toggling LED...")
    # toggle led
    return "OK"

@app.route("/uv")
def uv():
    print("Toggling UV...")
    # toggle uv
    return "OK"


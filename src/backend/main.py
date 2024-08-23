import base64
import json
import logging
import os.path
import random
import sys
from pathlib import Path

import cv2
from flask import Flask, Response, jsonify, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO

module_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(module_dir))

from model.yolov8 import ObjectTracker

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
cors = CORS(app)
MAX_FILE_SIZE = 1024 * 1024 * 1024
BASE_DIR = str(Path(__file__).resolve().parent.parent.parent)
app.config["SECRET_KEY"] = "werty57i39fj92udifkdb56fwed232z"
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE
app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "video")

socketio = SocketIO(app, cors_allowed_origins="*", logger=True)


def get_first_frame(video_path):
    vidcap = cv2.VideoCapture(video_path)
    success, image = vidcap.read()
    if success:
        res = str(base64.b64encode(cv2.imencode(".png", image)[1]))[2:-1]
        height, width, _ = image.shape
        return res, height, width
    else:
        return False


@app.route("/upload_video", methods=["POST"])
def avatar_upload():
    file = request.files["video"]
    if file.filename:
        file_bytes = file.read()
        file.close()
        upload_folder = app.config["UPLOAD_FOLDER"]
        try:
            os.mkdir(upload_folder)
        except FileExistsError:
            pass
        video_id = random.getrandbits(32)
        filename = f"video_{video_id}.{file.filename.split()[-1]}"
        file_path = os.path.join(upload_folder, filename)
        file_sv = open(file_path, "wb")
        file_sv.write(file_bytes)
        file_sv.close()
        preview, height, width = get_first_frame(file_path)
        return jsonify(
            {
                "success": True,
                "video_id": video_id,
                "height": height,
                "width": width,
                "preview": preview,
            }
        )
    else:
        return Response(
            "Файл потерялся",
            status=400,
        )


@socketio.on("lines")
def lines_handler(raw_lines):
    lines = json.loads(raw_lines)
    print(lines)
    socketio.emit("lol", "popa")


def send_preview(video):
    file = open(r"D:\Desktop\python_projects_2022\traffic-counter\road2.webp", "rb")
    file_data = file.read()
    file.close()
    preview = {
        "file": str(base64.b64encode(file_data))[2:-1],
        "height": 720,
        "width": 1280,
    }
    socketio.emit("preview", preview)


@socketio.on("connect")
def test_connect(data):
    logger.info("connected by socket.io")


@app.route("/aaa")
def test_aa():
    return "<p>Hello, World!</p>"


@socketio.on("test")
def test_popa(data):
    socketio.send(data)


@socketio.on("video")
def handle_video(data):
    send_preview(data)


if __name__ == "__main__":
    socketio.run(app, port=9139, allow_unsafe_werkzeug=True)

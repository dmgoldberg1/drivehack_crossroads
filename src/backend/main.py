import base64
import json
import logging
import os.path
import random
import sys
from pathlib import Path
from threading import Thread

import cv2
from flask import Flask, Response, jsonify, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO
from gevent import monkey

monkey.patch_all(ssl=False, time=False)

module_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(module_dir))

from model.yolov8 import ObjectTracker

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.DEBUG,
)
logger = logging.getLogger(__name__)
tracker_model = ObjectTracker()
app = Flask(__name__)
cors = CORS(app)
MAX_FILE_SIZE = 1024 * 1024 * 1024
BASE_DIR = str(Path(__file__).resolve().parent.parent.parent)
app.config["SECRET_KEY"] = "werty57i39fj92udifkdb56fwed232z"
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE
app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "video")
video_table = dict()
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, async_mode='gevent', async_handlers=True, )


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
        video_table[video_id] = file_path
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


def prep_video(video_id, lines):
    logger.info("Video in processing")
    result = tracker_model.process_video(
        video_path=video_table[video_id], input_dict=lines
    )
    logger.info("Video processing completed")
    socketio.emit("lines_result", result)
    return None


th = None


@socketio.on("lines")
def lines_handler(raw_lines):
    global th
    lines = json.loads(raw_lines)
    video_id = lines["video_id"]
    th = Thread(target=prep_video, args=(video_id, lines))
    th.daemon = True
    th.start()


@socketio.on("connect")
def test_connect(data):
    logger.info("connected by socket.io")


@socketio.on("test")
def test_socket(data):
    socketio.send(data)


if __name__ == "__main__":
    socketio.run(app, port=9139, allow_unsafe_werkzeug=True)

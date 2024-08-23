import cv2
from deep_sort_realtime.deepsort_tracker import DeepSort
from PIL import Image, ImageDraw
from ultralytics import YOLO
from utils import check_intersection

trail_img = Image.new(mode="RGB", size=(1280, 720))  # for debug
draw = ImageDraw.Draw(trail_img)  # for debug
draw.line((20, 20, 30, 720), fill="pink", width=5)  # for debug


class ObjectTracker:
    def __init__(self):
        self.model = YOLO("yolov8n.pt")
        self.model.to("cuda")
        # Инициализация DeepSort
        self.deepsort = DeepSort(max_age=10)
        self.memory = dict()
        self.lines_count_dict = dict()

    def process_video(self, video_path, input_dict):
        cap = cv2.VideoCapture(video_path)
        self.input_dict = input_dict
        self.lines_count_dict = {obj["id"]: 0 for obj in input_dict["lines"]}
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            results = self.model.predict(frame, classes=[2, 3, 5, 7])
            bboxes = results[0].boxes.xyxy.cpu().numpy()
            confidences = results[0].boxes.conf.cpu().numpy()
            classes = results[0].boxes.cls.cpu().numpy()

            bbox_xywh = []
            for bbox, conf, cls in zip(bboxes, confidences, classes):
                x1, y1, x2, y2 = bbox
                bbox_xywh.append(([x1, y1, x2 - x1, y2 - y1], conf, cls))
            outputs = self.deepsort.update_tracks(bbox_xywh, frame=frame)
            for track in outputs:
                if not track.is_confirmed():
                    continue
                bbox = track.to_tlbr()
                x, y, x_, y_ = int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])
                bbox_center = ((x + x_) // 2, (y + y_) // 2)
                x_new = bbox_center[0]
                y_new = bbox_center[1]
                track_id = track.track_id

                if track_id not in self.memory.keys():
                    self.memory[track_id] = bbox_center
                else:
                    # считаем коэффициенты прямой и обновляем последнюю точку
                    # print(memory)
                    x_old, y_old = self.memory[track_id][0], self.memory[track_id][1]
                    if x_new == x_old:
                        continue
                    else:
                        k = (y_new - y_old) / (x_new - x_old)
                        b = y_old - k * x_old
                        for i in range(len(input_dict["lines"])):
                            lines_array = input_dict["lines"][i]["points"]
                            line_name = input_dict["lines"][i]["id"]
                            if check_intersection(
                                    k, b, x_new, y_new, x_old, y_old, lines_array
                            ):
                                if line_name not in self.lines_count_dict.keys():
                                    self.lines_count_dict[line_name] = 1
                                else:
                                    self.lines_count_dict[line_name] += 1

                        self.memory[track_id] = bbox_center
                        # print(memory)

                # trail_img.putpixel(bbox_center, (255, 0, 0))
                # cv2.rectangle(frame, (x, y), (x_, y_), (0, 255, 0), 2)
                # cv2.putText(
                #     frame,
                #     f"ID: {track_id}",
                #     (int(bbox[0]), int(bbox[1]) - 10),
                #     cv2.FONT_HERSHEY_SIMPLEX,
                #     0.9,
                #     (255, 255, 255),
                #     2,
                # )
            # cv2.imshow("Object Tracking", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
        cap.release()
        return self.lines_count_dict


tracker = ObjectTracker()
example_dict = {
    "lines": [{"id": "popaname", "points": [20, 20, 30, 720], "direction": 1}]
}
if __name__ == "__main__":
    print(tracker.process_video("test.mp4", example_dict))

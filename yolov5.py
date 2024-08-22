from PIL import Image, ImageDraw
import cv2
from yolov5 import YOLOv5
from deep_sort_realtime.deepsort_tracker import DeepSort
from utils import check_intersection



model = YOLOv5("yolov5s.pt")

# Инициализация DeepSort
deepsort = DeepSort(max_age=5)

# Захват видео
video_path = "test.mp4"
trail_img = Image.new(mode="RGB", size=(1280, 720))
draw = ImageDraw.Draw(trail_img)

cap = cv2.VideoCapture(video_path)
memory = dict()
lines_array = [20, 20, 30, 720]#example
count = 0
draw.line((20, 20, 30, 720), fill='pink', width=5)#example


while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    results = model.predict(frame)
    bboxes = results.xyxy[0].cpu().numpy()

    bbox_xywh = []
    for bbox in bboxes:
        x1, y1, x2, y2, conf, cls = bbox
        if int(cls) in (2, 5, 3, 7):
            bbox_xywh.append(([x1, y1, x2 - x1, y2 - y1], conf, cls))
    outputs = deepsort.update_tracks(bbox_xywh, frame=frame)
    for track in outputs:
        if not track.is_confirmed():
            continue
        bbox = track.to_tlbr()
        x, y, x_, y_ = int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])
        bbox_center = ((x + x_) // 2, (y + y_) // 2)
        x_new = bbox_center[0]
        y_new = bbox_center[1]
        track_id = track.track_id

        if track_id not in memory.keys():
            memory[track_id] = bbox_center
        else:
            #считаем коэффициенты прямой и обновляем последнюю точку
            print(memory)
            x_old, y_old = memory[track_id][0], memory[track_id][1]
            if x_new == x_old:
                continue
            else:
                k = (y_new - y_old) / (x_new - x_old)
                b = y_old - k * x_old
                if check_intersection(k, b, x_new, y_new, x_old, y_old, lines_array):
                    count += 1#тут должен быть словарь с линиями какой-будь

                memory[track_id] = bbox_center
                print(memory)


        trail_img.putpixel(bbox_center, (255, 0, 0))

        cv2.rectangle(frame, (x, y), (x_, y_), (0, 255, 0), 2)
        cv2.putText(frame, f"ID: {track_id}", (int(bbox[0]), int(bbox[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                    (255, 255, 255), 2)

    cv2.imshow('Object Tracking', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
trail_img.show()
print(count)
cap.release()
cv2.destroyAllWindows()

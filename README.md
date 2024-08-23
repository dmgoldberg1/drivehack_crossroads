# DriveHack Crossroads

Добро пожаловать в проект **DriveHack Crossroads**! Этот репозиторий содержит фронтенд и бэкенд приложения. Фронтенд построен с использованием React и TypeScript, а бэкенд написан на Python.
## 🚀 Демо

Посмотреть рабочую версию проекта можно здесь: [**Нажмите сюда**](https://dmgoldberg1.github.io/drivehack_crossroads/)

## Frontend

Фронтенд создан с нуля с использованием [React](https://react.dev/) на TypeScript и технологии управления состоянием [Redux-Toolkit](https://redux-toolkit.js.org/), а также `WebSocket` для работы в реальном времени.



### 🛠 Как скомпилировать

Для компиляции проекта выполните следующие команды:

```bash
npm run prettier-format
npm run build
```

Для локальной разработки и тестирования рекомендуется использовать расширение [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) для VSCode.
> **Примечание:** Сейчас проект размещен на `GitHub Pages`.


## Backend

Бэкенд реализован на Python и включает в себя мощные инструменты для компьютерного зрения:

- [**YOLOv8 от Ultralytics**](https://github.com/ultralytics/ultralytics): Используется для обнаружения объектов в реальном времени. 
- [**Deep SORT Realtime**](https://github.com/levan92/deep_sort_realtime): Применяется для трекинга объектов в реальном времени.

### 💻 Как установить (Windows)

Для установки и запуска бэкенда выполните следующие команды:

```bash
git clone https://github.com/dmgoldberg1/drivehack_crossroads
cd drivehack_crossroads
python -m venv venv
venv\Scripts\activate
pip install -r requirements/web-requirements.txt -r requirements/ml-requirements.txt
cd src\backend
python main.py
```

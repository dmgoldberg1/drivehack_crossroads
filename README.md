# drivehack_crossroads
## Frontend

Создано с нуля на [React](https://react.dev/) Type Scipt с использованием технологии менеджера состояния приложения [Redux-Toolkit](https://redux-toolkit.js.org/) и `WebSocket`

### Демо

Посмотреть работу вы можете здесь: [*Клик*](https://dmgoldberg1.github.io/drivehack_crossroads/)

### Как скомпилить

```
npm run prettier-format
npm run build
```

> Для хостинга используется `GithubPages`

Для локального запуска и тестирования используется расширение [Live-Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) для VSCode

## Backend
Windows
```python
git clone https://github.com/dmgoldberg1/drivehack_crossroads
cd drivehack_crossroads
python -m venv venv
venv\Scripts\activate
pip install -r requirements/web-requirements.txt -r requirements/ml-requirements.txt
cd src\backend
python main.py
```

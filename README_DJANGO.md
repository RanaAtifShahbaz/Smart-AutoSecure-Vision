# Smart AutoSecure Vision - Django Backend

This project has been migrated from Flask to Django.

## Prerequisites

- Python 3.8+
- Dependencies listed in `requirements.txt`

## Installation

```bash
pip install -r requirements.txt
```

## Running the Server

Use the standard Django management command:

```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`.

## Project Structure

- `manage.py`: Django entry point.
- `smart_vision_django/`: Django project settings and URLs.
- `core/`: Main application logic (Migrated from `app.py`).
  - `views.py`: Web routes and view logic.
  - `camera_manager.py`: Computer vision and camera logic.
  - `auth_manager.py`: Authentication logic.
  - `emergency_manager.py`: Emergency contact logic.
  - `models.py`: (Empty for now, using MongoDB/JsonDB directly).
- `templates/`: HTML templates.
- `static/`: Static assets (CSS, JS, Uploads).

## Notes

- The original `app.py` is deprecated but kept for reference.
- MongoDB or local JSON DB is used for data storage (same as before).
- `yolov8n.pt` should be in the root directory.

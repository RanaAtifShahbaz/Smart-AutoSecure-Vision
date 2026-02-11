from core.camera_manager import CameraManager
import os

config = {'UPLOAD_FOLDER': 'static/uploads'}
# Mock DB
class MockDB:
    def __getitem__(self, name):
        return self
    def find(self, *args, **kwargs):
        return []
    def find_one(self, *args, **kwargs):
        return None

db = MockDB()

print("Initializing CameraManager...")
try:
    cm = CameraManager(config, db)
    print("CameraManager initialized successfully!")
except Exception as e:
    print(f"Failed to initialize CameraManager: {e}")
    import traceback
    traceback.print_exc()

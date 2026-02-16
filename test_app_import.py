try:
    from app import app
    print("App import successful")
except Exception as e:
    print(f"App import failed: {e}")
except SystemExit:
    pass

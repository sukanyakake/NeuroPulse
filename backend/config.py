import os

class Config:
    # Basic Project Info
    PROJECT_NAME = "NeuroPulse AI"
    DEBUG = True
    PORT = 5000
    
    # Database Path
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, 'database', 'db.sqlite3')
    
    # AI Model Path
    MODEL_PATH = os.path.join(BASE_DIR, 'models', 'lstm_model.h5')
    
    # Feature Thresholds for Mock Logic
    SCREEN_TIME_THRESHOLD = 400  # Minutes
    SLEEP_THRESHOLD = 6.0        # Hours
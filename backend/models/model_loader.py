from tensorflow.keras.models import load_model
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "lstm_model.h5")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.save")

model = load_model(MODEL_PATH, compile=False)
scaler = joblib.load(SCALER_PATH)
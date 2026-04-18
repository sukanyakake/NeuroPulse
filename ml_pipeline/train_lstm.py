import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import joblib

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("../backend/data/mental_health_lstm_dataset_6000.csv")

# FEATURES
features = [
    "screen_time", "sleep", "steps", "unlocks", "mood",
    "sleep_deficit", "activity_score", "screen_intensity",
    "mood_inversion", "weekday_flag", "late_night_flag"
]

target = "risk_target"

# =========================
# NORMALIZE
# =========================
scaler = MinMaxScaler()
df[features] = scaler.fit_transform(df[features])

# save scaler
joblib.dump(scaler, "../backend/models/scaler.save")

# =========================
# BUILD SEQUENCES
# =========================
def create_sequences(data, seq_length=7):
    X, y = [], []

    for user_id in data["user_id"].unique():
        user_data = data[data["user_id"] == user_id]

        for i in range(len(user_data) - seq_length):
            seq = user_data.iloc[i:i+seq_length][features].values
            label = user_data.iloc[i+seq_length][target]

            X.append(seq)
            y.append(label)

    return np.array(X), np.array(y)

X, y = create_sequences(df)

print("X shape:", X.shape)
print("y shape:", y.shape)

# =========================
# MODEL
# =========================
model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(7, len(features))),
    LSTM(32),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse')

# =========================
# TRAIN
# =========================
model.fit(X, y, epochs=10, batch_size=32)

# =========================
# SAVE MODEL
# =========================
model.save("../backend/models/lstm_model.h5")

print("✅ MODEL TRAINED & SAVED")
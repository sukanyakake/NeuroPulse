-- NeuroPulse AI Database Schema
CREATE TABLE IF NOT EXISTS user_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    screen_time_mins INTEGER,
    step_count INTEGER,
    sleep_hours REAL,
    unlock_count INTEGER,
    predicted_risk REAL
);

CREATE TABLE IF NOT EXISTS user_metadata (
    user_id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER,
    profession TEXT
);
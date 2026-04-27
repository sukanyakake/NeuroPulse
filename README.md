# ✨ NEUROPULSE 
###  Mental Health Risk Prediction Using Behavioral Data 

**A Major Project by Sukanya Kake** *Final Year B.Tech, Computer Science and Engineering*

## 👩‍💻 Author
**Sukanya Kake** 

GIT HUB REPOSITORY 

**NEUROPULSE** ([https://github.com/sukanyakake/NeuroPulse])

---

## 📌 Project Overview
**NeuroPulse** is a proactive mental health monitoring system that bridges the gap between digital behavior and psychological well-being. By analyzing non-invasive telemetry—**sleep patterns, screen usage, physical activity, and mood**—it predicts potential mental stress risks before they escalate.

Unlike traditional reactive surveys, NeuroPulse uses a **Hybrid AI Model** (LSTM + Rule-Based Heuristics) to provide both long-term trend forecasting and immediate "red-flag" detection.

---

## 🛠️ Tech Stack

### **Frontend (Intelligence Dashboard)**
* ⚛️ **React.js** - Component-based architecture for a dynamic UI.
* 🎨 **Tailwind CSS** - Mobile-first, responsive dark-themed styling.
* 📈 **Recharts** - Dynamic visualization of 72-hour risk forecasts and behavioral trends.
* 🔄 **Axios** - Efficient asynchronous communication with the Flask API.

### **Backend (Secure API Engine)**
* 🔥 **Flask** - Lightweight Python-based RESTful service.
* 🍃 **MongoDB** - NoSQL database for flexible and scalable behavioral logs.
* 🔐 **JWT / Bcrypt** - Secure token-based authentication and industry-standard password hashing.
* ⚙️ **Dotenv** - Secure management of environment variables and secrets.

### **Machine Learning (Prediction Engine)**
* 🧠 **LSTM (Long Short-Term Memory)** - Recurrent Neural Network (Deep Learning) for time-series analysis.
* 🔢 **NumPy & Pandas** - Advanced data windowing and sequence preprocessing.
* ⚙️ **Scikit-learn** - Robust feature scaling, normalization, and model evaluation.

---

## 🚀 Key Features

* **📊 Hybrid Risk Prediction:** Merges Deep Learning (LSTM) trends with clinical rule-based logic for high accuracy.
* **📈 72-Hour Forecast:** Predictive trend lines visualizing future mental health trajectories.
* **📱 Device Telemetry Logs:** Automated and manual data ingestion for tracking sleep, steps, and usage.
* **🧠 Explainable AI (XAI):** The hybrid layer provides human-readable reasons for high-risk scores.
* **📱 Responsive Design:** Fully optimized for seamless viewing on Desktop, Tablet, and Mobile.

---

## 📁 Project Structure

```text
NeuroPulse/
├── backend/                # Flask Server Logic
│   ├── api/                # Route handlers (auth, telemetry, predict)
│   ├── database/           # MongoDB Connection & Schemas
│   ├── models/             # Predictor Logic & Model Loaders
│   └── .env                # Environment Config (HIDDEN)
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components (Cards, Nav, Modals)
│   │   ├── pages/          # Full Page Views (Dashboard, Analytics)
│   │   └── services/       # API Integration Layer
├── ml_pipeline/            # Train the model
└── README.md               # Project Documentation
```

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**
```bash
git clone [https://github.com/sukanyakake/NeuroPulse.git](https://github.com/sukanyakake/NeuroPulse.git)
cd NeuroPulse
```

### **2. Environment Configuration**
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_cluster_connection_string
SECRET_KEY=your_flask_secret_key
MODEL_FILE_PATH=./ml_pipeline/models/lstm_mood_model.h5
SCALER_FILE_PATH=./ml_pipeline/models/feature_scaler.pkl
```

### **3. Install Dependencies**
```bash
# Setup Backend
cd backend
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
npm install
```

### **4. Run Application**
```bash
# Terminal 1: Start Backend
python app.py

# Terminal 2: Start Frontend
npm start
```

---

## 🧠 Machine Learning Methodology
The core of NeuroPulse is a **Deep Learning** model specifically designed for temporal sequences. 
1. **Data Ingestion:** Collects 7-day windows of behavioral metrics.
2. **Preprocessing:** Normalizes data using a Min-Max Scaler to ensure model stability.
3. **LSTM Inference:** Processes the sequence to identify patterns (e.g., cumulative sleep deprivation).
4. **Heuristic Fusion:** Merges LSTM output with a Rule-Based risk score to provide "Explainable" results.




```

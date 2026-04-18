import os
import sys
import socket
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env
load_dotenv()

# Fix imports
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Routes
from api.routes_dashboard import dashboard_bp
from api.routes_behaviour import behaviour_bp
from api.routes_datasources import datasources_bp
from api.routes_action_center import action_center_bp
from api.routes_prediction import prediction_bp
from api.routes_auth import auth_bp

# App init
app = Flask(__name__)
CORS(app)

# Register APIs
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(behaviour_bp, url_prefix='/api/behaviour')
app.register_blueprint(datasources_bp, url_prefix='/api/datasources')
app.register_blueprint(action_center_bp, url_prefix='/api/action')
app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Health check
@app.route('/')
def health_check():
    return jsonify({
        "status": "online",
        "message": "NeuroPulse Backend Running"
    })


def get_wifi_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 1))
        IP = s.getsockname()[0]
    except:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP


if __name__ == "__main__":
    print(f"🚀 SERVER RUNNING AT: http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
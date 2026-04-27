from flask import Blueprint, request, jsonify
from database.db_connection import users_col
from datetime import datetime, timedelta
import hashlib
import uuid
import jwt
import re
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = "neuropulse"

auth_bp = Blueprint('auth', __name__)


# =========================
# 🔐 HELPER: VALIDATE EMAIL
# =========================
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


# =========================
# 🔐 SIGNUP
# =========================
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email", "").lower().strip()
        password = data.get("password", "")

        # ✅ VALIDATION
        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        if not password:
            return jsonify({"error": "Password is required"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        # ✅ CHECK EXISTING USER
        if users_col.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        # ✅ HASH PASSWORD
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # ✅ GENERATE USER ID
        user_id = str(uuid.uuid4())[:8]

        # ✅ STORE USER
        users_col.insert_one({
            "user_id": user_id,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.now()
        })

        return jsonify({
            "message": "Signup successful",
            "user_id": user_id
        }), 200

    except Exception as e:
        print("SIGNUP ERROR:", str(e))
        return jsonify({"error": "Internal server error"}), 500


# =========================
# 🔐 LOGIN
# =========================
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email", "").lower().strip()
        password = data.get("password", "")

        # ✅ VALIDATION
        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        if not password:
            return jsonify({"error": "Password is required"}), 400

        # ✅ HASH PASSWORD
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # ✅ FIND USER
        user = users_col.find_one({
            "email": email,
            "password": hashed_password
        })

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # ✅ GENERATE JWT TOKEN
        token = jwt.encode({
            "user_id": user["user_id"],
            "exp": datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "token": token,
            "user_id": user["user_id"]
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return jsonify({"error": "Internal server error"}), 500
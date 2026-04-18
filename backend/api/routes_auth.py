from flask import Blueprint, request, jsonify
from database.db_connection import users_col
from datetime import datetime, timedelta  # ✅ FIX IMPORT

import hashlib
import uuid
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = "neuropulse"

auth_bp = Blueprint('auth', __name__)


# =========================
# 🔐 SIGNUP
# =========================
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Missing fields"}), 400

        # ✅ normalize email
        email = email.lower().strip()

        # ✅ check existing user
        if users_col.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        # ✅ hash password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # ✅ generate unique user_id
        user_id = str(uuid.uuid4())[:8]

        user = {
            "user_id": user_id,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.now()
        }

        users_col.insert_one(user)

        return jsonify({
            "message": "Signup successful",
            "user_id": user_id
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# =========================
# 🔐 LOGIN (JWT)
# =========================@auth_bp.route('/login', methods=['POST'])

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json

        email = data.get("email").lower().strip()
        password = data.get("password")

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        user = users_col.find_one({
            "email": email,
            "password": hashed_password
        })

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # 🔐 FIXED JWT
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
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, jsonify
from services.behaviour_service import BehaviourService
from utils.auth_utils import get_user_from_token  # ✅ ADD THIS

behaviour_bp = Blueprint('behaviour', __name__)


@behaviour_bp.route('/stats', methods=['GET'])
def get_behaviour_stats():
    try:
        # 🔐 GET USER FROM TOKEN
        user_id = get_user_from_token()

        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        stats = BehaviourService.get_detailed_stats(user_id)

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
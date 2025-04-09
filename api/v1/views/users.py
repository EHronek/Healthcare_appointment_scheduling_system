#!/usr/bin/python3
from flask import jsonify, request
from models.user import User
from api.v1.views import app_views
from models import storage
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from helper_functions import is_admin




@app_views.route('/users', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_users():
    """Gets all the users in the database"""
    if not is_admin():
        return jsonify({"error": "admin privileges required"}), 403
    users = storage.all(User).values()
    return jsonify([user.to_dict() for user in users]), 200


@app_views.route('/users/me', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = storage.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200


@app_views.route('/users/<user_id>', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_user_by_id(user_id):
    """Retrieves a specific user from the database"""
    current_user_id = get_jwt_identity()
    if str(current_user_id) != user_id and not is_admin():
        return jsonify({"error": "unauthorized"}), 403

    user = storage.get(User, user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify(user.to_dict()), 200


@app_views.route('/users', methods=["POST"], strict_slashes=False)
def create_user():
    """Creates a new user """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid json data"}), 400
    
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing {field}"}), 400
        
    if data['role'] not in ['admin', 'doctor', 'patient']:
        return jsonify({"error": "Invalid role"}), 400
        
    new_user = User()
    new_user.name=data["name"],
    new_user.password=new_user._hash_password(data['password']),
    new_user.role=data["role"],
    new_user.email=data["email"]

    storage.new(new_user)
    storage.save()
    return jsonify(new_user.to_dict()), 201


@app_views.route("/users/<user_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update_user(user_id):
    """Update an existing user"""
    user = storage.get(User, user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404
    
    current_user_id = get_jwt_identity()
    if str(current_user_id) != user_id and not is_admin():
        return jsonify({"error": "unauthorized"}), 403
    
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "not a valid json"}), 400
    
    for key, value in data.items():
        if key == "password":
            value = user._hash_password(value)
        if key in ["name", "email", "password", "role"]:
            setattr(user, key, value)
    storage.save()
    return jsonify(user.to_dict()), 200


@app_views.route("/users/<user_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def delete_user(user_id):
    """Deletes a specific user by id"""
    user = storage.get(User, user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404
    
    current_user_id = get_jwt_identity()
    if str(current_user_id) != user_id and not is_admin():
        return jsonify({"error": "unauthorized"}), 403
    
    storage.delete(user)
    storage.save()
    return jsonify({"message": "User deleted"}), 200
    

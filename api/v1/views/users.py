#!/usr/bin/python3
from flask import jsonify, request
from models.user import User
from api.v1.views import app_views
from models import storage

@app_views.route('/users', methods=["GET"], strict_slashes=False)
def get_users():
    """Gets all the users in the database"""
    users = storage.all(User).values()
    return jsonify([user.to_dict() for user in users]), 200


@app_views.route('/users/<user_id>', methods=["GET"], strict_slashes=False)
def get_user_by_id(user_id):
    """Retrieves a specific user from the database"""
    user = storage.get(User, user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify(user.to_dict()), 200


@app_views.route('/users/', methods=["POST"], strict_slashes=False)
def create_user():
    """Creates a new user """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid json data"}), 400
    
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing {field}"}), 400
        
    new_user = User(
        name=data["name"],
        password=User()._hash_password(data['password']),
        role=data["role"],
        email=data["email"]
    )
    storage.new(new_user)
    storage.save()
    return jsonify(new_user.to_dict()), 201


@app_views.route("/users/<user_id>", methods=["PUT"], strict_slashes=False)
def update_user(user_id):
    """Update an existing user"""
    user = storage.get(User, user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404
    
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
def delete_user(user_id):
    """Deletes a specific user by id"""
    user = storage.get(User, user_id)

    if not user:
        return jsonify({"error": "user not found"})
    storage.delete(user)
    storage.save()
    return jsonify({"message": "User deleted"}), 200
    

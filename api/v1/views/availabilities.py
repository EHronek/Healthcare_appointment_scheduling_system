#!/usr/bin/env python3
""" Endpoint for availabilities CRUD operations"""
from models import storage
from flask import jsonify, request
from models.availability import Availability
from models.doctor import Doctor
from api.v1.views import app_views
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.v1.helper_functions import role_required


@app_views.route("/availabilities", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_all_availabilities():
    """Retrieves all the availability data"""
    availabilities = storage.all(Availability).values()

    if not availabilities:
        return jsonify({"error": "availabilities not found"}), 404
    return jsonify([availability.to_dict() for availability in availabilities]), 200


@app_views.route("/availabilities/<string:availability_id>", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_availability(availability_id):
    """Retrieves a specific availability data"""
    availability = storage.get(Availability, availability_id)

    if not availability:
        return jsonify({"error": "availability not found"}), 404

    return jsonify(availability.to_dict()), 200


@app_views.route("/availabilities", methods=["POST"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'doctor')
def create_availability():
    """creates a new availability record"""
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "not a valid json"}), 400
    
    required_fields = ["doctor_id", "day_of_week", "start_time", "end_time"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"missing field '{field}'"}), 400
        
    is_valid_id = storage.find(Doctor, data.get('doctor_id'))
    if not is_valid_id:
        return jsonify({"error": "doctor id is invalid"}), 400
        
    new_avail = Availability(
        doctor_id=data.get('doctor_id'),
        day_of_week=data.get('day_of_week'),
        start_time=data.get('start_time'),
        end_time=data.get('end_time')
    )

    try:
        storage.new(new_avail)
        storage.save()
        return jsonify(new_avail.to_dict()), 201
    except Exception as e:
        print(e)
        return jsonify({"error": f"Error saving"}), 500


@app_views.route("/availabilities/<string:availability_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'doctor')
def update_availability(availability_id):
    """Updates a specific availability id"""
    availability = storage.get(Availability, availability_id)

    if not availability:
        return jsonify({"error": "availabilty not found"}), 404
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "not a valid json"}), 400

    if data.get("doctor_id"):
        is_valid_id = storage.find(Doctor, data.get('doctor_id'))
        if not is_valid_id:
            return jsonify({"error": "doctor id is invalid"}), 400
    
    keys_to_ignore = {"id", "created_at", "updated_at"}

    for k, v in data.items():
        if k not in keys_to_ignore:
            setattr(availability, k, v)

    try:
        availability.save()
        return jsonify(availability.to_dict()), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "problem saving data"}), 500


@app_views.route("/availabilities/<string:availability_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'doctor')
def delete_availability(availability_id):
    """deletes a specific availability id record"""
    availability = storage.get(Availability, availability_id)
    if not availability:
        return jsonify({"error": "availability not found"})
    try:
        storage.delete(availability)
        storage.save()
        return jsonify({"message": "availability deleted succefully"}), 200
    except Exception as e:
        print("error deleting", e)
        return jsonify({"error": "deletion not succefull"})
    


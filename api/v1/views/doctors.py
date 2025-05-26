#!/usr/bin/env python3
"""Endpoint for Doctor"""
from models import storage
from flask import jsonify, request
from models.doctor import Doctor
from api.v1.views import app_views
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.v1.helper_functions import role_required
import re


@app_views.route('/doctors', methods=["GET"], strict_slashes=False)
@jwt_required()
@role_required('admin')
def get_all_doctors():
    """Retrieves all doctors data from db"""
    doctors = storage.all(Doctor).values()

    if not doctors:
        return jsonify({"error": "not found"}), 400
    return jsonify([doc.to_dict() for doc in doctors]), 200


@app_views.route('/doctors/<string:doctor_id>', methods=["GET"], strict_slashes=False)
@jwt_required()
#@role_required('admin', 'doctor')
def get_doctor_by_id(doctor_id):
    """Get a specific doctor data"""
    doctor = storage.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "doctor not found"})
    return jsonify(doctor.to_dict()), 200


@app_views.route("/doctors", methods=["POST"], strict_slashes=False)
@jwt_required()
@role_required("admin")
def create_doctor():
    """Creates a new doctor"""
    request_data = request.get_json(silent=True)
    if not request_data:
        return jsonify({"error": "not a json"}), 400
    
    required_fields = ["first_name", "last_name", "email", "specialization", "user_id"]

    for field in required_fields:
        if field not in request_data:
            return jsonify({"error": f"missing {field}"}), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", request_data["email"]):
        return jsonify({"error": "Invalid email format"}), 400
    
    doctors = storage.all(Doctor).values()

    if doctors:
        for doctor in doctors:
            if doctor.email == request_data["email"]:
                return jsonify({"error": f"email not available, try a different email"}), 400
    
    new_doctor = Doctor(
        first_name=request_data['first_name'],
        last_name=request_data['last_name'],
        email=request_data['email'],
        specialization=request_data['specialization'],
        user_id=request_data['user_id']
    )
    storage.new(new_doctor)
    storage.save()

    return jsonify(new_doctor.to_dict()), 201


@app_views.route("/doctors/<string:doctor_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required("admin", "doctor")
def update_doctor(doctor_id):
    """update an existing doctor"""
    doctor = storage.get(Doctor, doctor_id)
    if not doctor:
        return jsonify({"error": "doctor not found"}), 404

    new_data = request.get_json(silent=True)

    if not new_data:
        return jsonify({"error": "not a valid json"})

    keys_to_ignore = {"id", "created_at", "updated_at"}

    for k, v in new_data.items():
        if k not in keys_to_ignore:
            setattr(doctor, k, v)
    doctor.save()
    return jsonify(doctor.to_dict()), 200


@app_views.route("/doctors/<string:doctor_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
@role_required("admin")
def delete_doctor(doctor_id):
    """Deletes a specific doctor"""
    doctor = storage.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "doctor not found"}), 404
    try:
        storage.delete(doctor)
        return jsonify({}), 200
    except Exception as e:
        print("Error: ", e)
        return jsonify({"error": "something went wrong"}), 500

    


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
        return jsonify({"error": "doctor not found"}), 404
    return jsonify(doctor.to_dict()), 200


@app_views.route('/doctors/<string:doctor_id>/availabilities', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_doctor_availabilities(doctor_id):
    """Retrieve all the doctor availabilities"""
    doctor = storage.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "doctor not found"}), 404
    doctor_avails = doctor.availability
    if len(doctor_avails) == 0:
        return jsonify({"message": "availability empty"}), 200
    if doctor_avails:
        return jsonify([avail.to_dict() for avail in doctor_avails]), 200
        

@app_views.route('/doctors/<string:doctor_id>/appointments', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_doctor_appointments(doctor_id):
    """retrieves a specific doctor appointments data"""
    doctor = storage.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "doctor not found"}), 404
    doctor_appointments = doctor.appointments
    if len(doctor.appointments) == 0:
        return jsonify({"message": "doctor's appointments empty"}), 200
    if doctor_appointments:
        return jsonify([appointment.to_dict() for appointment in doctor_appointments])


@app_views.route('/doctors/<string:doctor_id>/exceptions', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_doctor_exceptions(doctor_id):
    """Retrieves a specific doctor exceptions"""
    doctor = storage.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "doctor not found"}), 404
    doctor_exceptions = doctor.exceptions

    if len(doctor_exceptions) == 0:
        return jsonify({"message": "doctor's exceptions is empty"}), 200
    if doctor_exceptions:
        return jsonify([exception.to_dict() for exception in doctor_exceptions]), 200
        

@app_views.route('/doctors/<string:doctor_id>/medical_records', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_doctor_medical_records(doctor_id):
    """Retrieve medical records for all doctor appointments"""
    doctor = storage.get(Doctor, doctor_id)

    if not doctor:
        return jsonify({"error": "doctor not found"}), 404
    
    doctor_medical_records = doctor.medical_records

    if len(doctor_medical_records) == 0:
        return jsonify({"message": "medical records empty"}), 200
    
    if doctor_medical_records:
        return jsonify([medical_record.to_dict() for medical_record in doctor_medical_records]), 200



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

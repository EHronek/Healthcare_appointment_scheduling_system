#!/usr/bin/python3
""" Endpoints for Patient """
from models import storage
from flask import jsonify, request
from models.patient import Patient
from api.v1.views import app_views
from flask_jwt_extended import get_jwt_identity


@app_views.route('/patients', methods=["GET"], strict_slashes=False)
def get_patients():
    """Retrieves all the patients from the database"""
    patients = storage.all(Patient).values()

    """ if not patients:
        return jsonify({"error", "not found"}), 404 """
    
    return jsonify([patient.to_dict() for patient in patients]), 200

@app_views.route("/patients/<patient_id>", methods=["GET"], strict_slashes=False)
def get_patient_by_id(patient_id):
    """Retrieves a specific patient by id"""
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({"error": "not found"}), 404
    return jsonify(patient.to_dict()), 200


@app_views.route("/patients", methods=["POST"], strict_slashes=False)
def create_patient():
    """create a patient """
    data = request.get_json(silent=True)

    current_user_id = get_jwt_identity()['id']
    if not data:
        return jsonify({"error": "not a valid json"}), 400
    
    required_field = ["first_name", "last_name", "email", "phone_number", "insurance_provider", "insurance_number"]

    for field in required_field:
        if field not in data:
            return jsonify({"error": f"Missing {field}"}), 400
    
    new_patient = Patient(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone_number=data['phone_number'],
        insurance_number=data['insurance_number'],
        insurance_provide=data['insurance_provider']
        user_id=current_user_id
    )

    storage.new(new_patient)
    storage.save()

    return jsonify(new_patient.to_dict())
    
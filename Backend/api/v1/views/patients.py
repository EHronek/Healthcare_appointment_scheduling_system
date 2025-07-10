#!/usr/bin/python3
""" Endpoints for Patient """
from models import storage
from flask import jsonify, request
from models.patient import Patient
from api.v1.views import app_views
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.v1.helper_functions import role_required
import re
from models.user import User


@app_views.route('/patients', methods=["GET"], strict_slashes=False)
@jwt_required()
@role_required('admin')
def get_all_patients():
    """Retrieves all the patients from the database"""
    patients = storage.all(Patient).values()
    #print([p.to_dict() for p in patients])

    if not patients:
        return jsonify({"error", "not found"}), 404
    
    return jsonify([patient.to_dict() for patient in patients]), 200


@app_views.route("/patients/<patient_id>", methods=["GET"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'patient')
def get_patient_by_id(patient_id):
    """Retrieves a specific patient by id"""
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({"error": "not found"}), 404
    return jsonify(patient.to_dict()), 200


@app_views.route('/patients/user/<string:user_id>', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_patient_by_user_id(user_id):
    """Retrieves a specific patient by user_id"""
    sess = storage.get_session()
    patient = sess.query(Patient).filter_by(user_id=user_id).first()
    if not patient:
        return jsonify({"error": "patient not found"}), 404
    return jsonify(patient.to_dict()), 200


@app_views.route('/patients/user/me', methods=["GET"], strict_slashes=False)
@jwt_required()
@role_required('patient')
def get_patient_from_session():
    """Retrieves patient data based on the current logged in user"""
    user_id = get_jwt_identity()
    current_user = storage.get(User, user_id)

    if not current_user:
        return jsonify({"error": "user not found"}), 404
    if current_user.role != 'patient':
        return jsonify({"error": "Unauthorized user, must be a patient"}), 403

    sess = storage.get_session()
    patient = sess.query(Patient).filter_by(user_id=user_id).first()
    
    if not patient:
        return jsonify({"error": "patient not found"}), 404
    return jsonify(patient.to_dict()), 200


@app_views.route("/patients", methods=["POST"], strict_slashes=False)
@jwt_required()
@role_required('admin', 'patient')
def create_patient():
    """create a patient """
    data = request.get_json(silent=True)

    current_user_id = get_jwt_identity()
    if not data:
        return jsonify({"error": "not a valid json"}), 400
    
    required_field = ["first_name", "last_name", "email", "phone_number", "insurance_provider", "insurance_number"]

    for field in required_field:
        if field not in data:
            return jsonify({"error": f"Missing {field}"}), 400
        
    if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        return jsonify({"error": "Invalid email format"}), 400
    
    patients = storage.all(Patient).values()

    if patients:
        # Check if patient with provided email already exists
        for patient in patients:
            if patient.email == data["email"]:
                return jsonify({"error": f"Patient with email {data['email']} already exists"}), 400
        
        # Checks if a patient with provided insurance_number already exists
        for patient in patients:
            if patient.insurance_number == data['insurance_number']:
                return jsonify({"error": "Can't use the Insurance number, contact admin"}), 400


    
    new_patient = Patient(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone_number=data['phone_number'],
        insurance_number=data['insurance_number'],
        insurance_provide=data['insurance_provider'],
        user_id=current_user_id
    )

    storage.new(new_patient)
    storage.save()

    return jsonify(new_patient.to_dict()), 201
    

@app_views.route("/patients/<string:patient_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update_patient(patient_id):
    """Updates a specific patient data"""
    patient = storage.get(Patient, patient_id)
    if not patient:
        return jsonify({"error": "patient not found"})
    
    new_data = request.get_json(silent=True)

    if not new_data:
        return jsonify({"error": "not a valid json"})
    
    
    keys_to_ignore = {"id", "created_at", "updated_at"}

    for k, v in new_data.items():
        if k not in keys_to_ignore:
            setattr(patient, k, v)
    patient.save()
    return jsonify(patient.to_dict()), 200


@app_views.route("/patients/<string:patient_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()

def delete_patient(patient_id):
    """Deletes a specific patient with id"""
    patient = storage.get(Patient, patient_id)

    if not patient:
        return jsonify({"error": "patient not found"}), 404
    
    storage.delete(patient)
    return jsonify({"message": "patient deleted successfully"}), 200 



@app_views.route("/patients/<string:patient_id>/appointments", methods=['GET'], strict_slashes=False)
@jwt_required()
@role_required('admin', 'patient')
def get_patient_appointment(patient_id):
    """Delete a specific patient """
    patient = storage.get(Patient, patient_id)
    user = patient.user

    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    
    if not patient.appointments:
        return jsonify({"error": "appointments not found"})
    return jsonify([appointment.to_dict for appointment in patient.appointments]), 200  

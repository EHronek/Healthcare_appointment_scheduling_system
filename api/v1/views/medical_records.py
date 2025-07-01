#!/usr/bin/env python3
"""Endpoint for Medical Records"""
from models import storage
from flask import jsonify, request
from models.medical_record import MedicalRecord
from flask_jwt_extended import get_jwt_identity, jwt_required
from api.v1.helper_functions import role_required, validate_medical_record
from api.v1.views import app_views
from models.user import User
from models.doctor import Doctor
from models.patient import Patient
from datetime import datetime
from models.appointment import Appointment


@app_views.route("medical-records", methods=["POST"], strict_slashes=False)
@jwt_required
@role_required('doctor', 'admin')
def create_medical_record():
    """Creates a medical record"""
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if not current_user:
        return jsonify({"Error": "Unauthorized"}), 401
    
    if current_user.role != "doctor":
        return jsonify({"error": "Unauthorized"}), 401
    
    doctors = storage.all(Doctor).values()
    doctor = None
    for doctor in doctors:
        if doctor.user == current_user:
            doctor = doctor

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "not a json"}), 400
    
    required_fields = ['appointment_id', 'patient_id', 'notes']
    if not  all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {required_fields}"}), 400
    
    errors = validate_medical_record(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    # Verify appointment exists and belongs to this doctor
    sess = storage.get_session()
    appointment = sess.query(Appointment).filter_by(
        id=data['appointment_id'],
        doctor_id=doctor.id,
        patient_id=data['patient_id']
    ).first()

    if not appointment:
        return jsonify({"error": "Appointment not found or unauthorized"}), 404
    
    # Create a record
    new_record = MedicalRecord(
        appointment_id=data['appointment_id'],
        patient_id=data['patient_id'],
        doctor_id=current_user.id,
        notes=data['notes'],
        prescriptions=data.get('prescriptions', '')
    )

    storage.new(new_record)
    storage.save()

    return jsonify({
        "id": new_record.id,
        "message": "Medical record created",
        "appointment_date": appointment.scheduled_time.isoformat()
    }), 201


@app_views.route('/medical-records/<string:record_id>', methods=["GET"], strict_slashes=False)
@jwt_required()
def get_medical_record(record_id):
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if not current_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    record = storage.get(MedicalRecord, record_id)
    if not record:
        return jsonify({"error": "record not found"}), 404
    
    if current_user.role == 'patient' and record.patient_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    if current_user.role == "doctor" and record.doctor_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    return jsonify({
        "id": record.id,
        "appointment_id": record.appointment_id,
        "doctor_id": record.doctor_id,
        "notes": record.notes,
        "prescriptions": record.prescriptions,
        "created_at": record.created_at.isoformat()
    }), 200


@app_views.route("/medical-record/<string:record_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
@role_required('doctor')
def update_medical_record(record_id):
    """Updates a specific medical record"""
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if not current_user or current_user.role != 'doctor':
        return jsonify({"error": "Unauthorized"}), 401
        
    record = storage.get(MedicalRecord, record_id)

    if not record:
        return jsonify({"error": "record not found"})
    
    # Verify ownership
    if record.doctor_id != current_user.id:
        return jsonify({"error": "Can only edit your own records"}), 403
    
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "not a valid json"}), 400
    
    errors = validate_medical_record(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    # update fields:
    if 'notes' in data:
        record.notes = data['notes']
    if 'prescriptions' in data:
        record.prescriptions = data['prescriptions']

    try:
        storage.save(record)
        return jsonify({
        "message": "Record updated",
        "updated_at": record.updated_at.isoformat()
    })
    except Exception as e:
        return jsonify({"error": "Error while saving: {e}"}), 500


@app_views.route('/medical-records/<string:record_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
@role_required('admin')
def delete_medical_record(record_id):
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
    
    record = storage.get(MedicalRecord, record_id)
    if not record:
        return jsonify({"error": "record not found"}), 404
    
    audit_log = {
        "action": "delete_medical_record",
        "record_id": record_id,
        "deleted_by": get_jwt_identity(),
        "timestamp": datetime.utcnow().isoformat()
    }

    storage.delete(record)
    storage.save()

    return jsonify({"message": "Record deleted"}), 200


@app_views.route('/medical-records/patient/<string:patient_id>', method=['GET'])
@jwt_required()
def get_patient_record(patient_id):
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if not current_user:
        return jsonify({"error": "Unauthorized"}), 401

    sess = storage.get_session()

    patient = sess.query(Patient).filter_by(user_id=current_user_id).first()

    if not patient:
        return jsonify({"Error": "patient not found"}), 404

    # Authorization
    if current_user.role == 'patient' and patient_id != patient.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    # Doctors can only see their own patients' records
    if current_user.role == 'doctor':
        records = sess.query(MedicalRecord).filter_by(
            patient_id=patient_id,
            doctor_id=current_user.id
        ).all()
    else:
        records = sess.query(MedicalRecord).filter_by(
            patient_id=patient_id
        ).all()
    
    return jsonify([{
        "id": r.id,
        "doctor_name": f"{r.doctor.first_name} {r.doctor.last_name}",
        "date": r.appointment.scheduled_time.isoformat(),
        "notes_preview": r.notes[:100] + "..." if r.notes else None
    } for r in records])


@app_views.route('/medical-records/appointments/<string:appointment_id>', method=["GET"])
@jwt_required()
def get_appointment_record(appointment_id):
    sess = storage.get_session()
    current_user_id = get_jwt_identity()
    current_user = storage.get(User, current_user_id)

    if not current_user:
        return jsonify({"error": "unauthorized"}), 401
    record = sess.query(MedicalRecord).filter_by(appointment_id=appointment_id).first()

    if not record:
        return jsonify({"error": "Not found"}), 404
    
    
    if current_user.role == 'patient':
        patient = sess.query(Patient).filter_by(user_id=current_user_id).first()

    if not patient:
        return jsonify({"error": "patient not found"}), 404
    
    if current_user.role == 'patient' and record.patient_id != patient.id:
        return jsonify({"error": "Unauthorized"}), 401
    
    if current_user.role == 'doctor':
        doctor = sess.query(Doctor).filter_by(user_id=current_user_id).first()
    if current_user.role == "doctor" and record.doctor_id != doctor.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify({
        "notes": record.notes,
        "prescriptions": record.prescriptions
    })

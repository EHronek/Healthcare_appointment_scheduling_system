#!/usr/bin/python3
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from functools import wraps
from flask_jwt_extended import create_access_token, create_refresh_token
from models.appointment import Appointment
from models.availability import Availability
from models.doctor import Doctor
from models import storage
from datetime import datetime, time, timedelta
import pytz
from sqlalchemy import func, String, and_, text
from models.exception import Exception as DoctorException


# Constants
MIN_APPOINTMENT_DURATION = 15
MAX_APPOINTMENT_DURATION = 120


def is_admin():
    """Helper to check if user has admin role for jwt"""
    claims = get_jwt()
    return claims.get('role') == 'admin'

def role_required(*allowed_roles):
    """Decorator to restrict access to users with specific role"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get('role')

            if user_role not in allowed_roles:
                print(user_role)
                print(allowed_roles)
                return jsonify({"msg": "Access denied: insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper


def generate_tokens_for_user(user):
    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    refresh_token = create_refresh_token(identity=str(user.id))
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


def is_doctor_available(doctor_id, start_time, duration, working_hours_start, working_hours_end, appointment_id_to_ignore=None):
    """
    Check if doctor is available to book an appointment.
    
    Parameters:
        doctor_id (str): ID of the doctor
        start_time (datetime): Proposed start time of the appointment
        duration (int): Duration in minutes
        working_hours_start (time): Start of daily working hours (e.g., time(8, 0))
        working_hours_end (time): End of daily working hours (e.g., time(17, 0))
        appointment_id_to_ignore (str): Optional. Appointment ID to exclude from conflict check (for editing)
    
    Returns:
        Tuple (bool, str): (Is available, message)
    """
    sess = storage.get_session()

    # Check if doctor exists
    doctor = sess.get(Doctor, doctor_id)
    if not doctor:
        return False, "Doctor not found"
    

    # Calculate end_time
    end_time = start_time + timedelta(minutes=duration)

    # Validate working hours
    if start_time.time() < working_hours_start:
        return False, "Start time outside working hours"
    if end_time.time() > working_hours_end:
        return False, "End time outside working hours"

    # Get weekday
    day_of_week = start_time.strftime('%A')

    # Fetch availability slots for this weekday
    available_slots = sess.query(Availability).filter_by(
        doctor_id=doctor_id,
        day_of_week=day_of_week
    ).all()

    slot_available = any(
        slot.start_time <= start_time.time() and
        slot.end_time >= end_time.time()
        for slot in available_slots
    )

    if not slot_available:
        return False, "Doctor not available on this day/time"

    # Check exceptions
    exception = sess.query(DoctorException).filter_by(
        doctor_id=doctor_id,
        date=start_time.date()
    ).first()

    if exception and not exception.is_available:
        return False, "Doctor has marked this date as unavailable"

    # Compute new appointment end time
    new_appointment_end = end_time

    # Query for conflicting appointments
    # Use MySQL TIMESTAMPADD(MINUTE, ...) to calculate end time of existing appointments
    existing_appointment_end = func.TIMESTAMPADD(text('MINUTE'), Appointment.duration, Appointment.scheduled_time)

    conflict_query = sess.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == 'scheduled',
        # Overlap condition:
        existing_appointment_end > start_time,         # existing ends after new starts
        Appointment.scheduled_time < new_appointment_end  # existing starts before new ends
    )

    # Exclude current appointment if provided (used when editing)
    if appointment_id_to_ignore:
        conflict_query = conflict_query.filter(Appointment.id != appointment_id_to_ignore)

    conflicting_appointments_count = conflict_query.count()

    if conflicting_appointments_count > 0:
        return False, "Time slot already booked"

    return True, "Available"


def validate_appointment_data(data):
    errors = {}

    required_fields = ['doctor_id', 'scheduled_time', 'duration', 'start_time', 'end_time']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        errors['missing'] = f"Required fields: {', '.join(missing_fields)}"

    # Duration validation
    if 'duration' in data:
        try:
            duration = int(data['duration'])
            if not MIN_APPOINTMENT_DURATION <= duration <= MAX_APPOINTMENT_DURATION:
                errors['duration'] = f"Duration must be between {MIN_APPOINTMENT_DURATION} - {MAX_APPOINTMENT_DURATION} minutes"
        except ValueError:
            errors['duration'] = "Invalid duration format"

    # Time validation
    if 'scheduled_time' in data:
        try:
            scheduled_time = datetime.fromisoformat(data['scheduled_time'])
            if scheduled_time < datetime.now() + timedelta(minutes=30):
                errors['time'] = "Appointment must be scheduled at least 30 minutes in advance"
        except ValueError:
            errors['time'] = "Invalid time format (use ISO 8601)"

    return errors

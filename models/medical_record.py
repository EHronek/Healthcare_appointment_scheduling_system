#!/usr/bin/python3
"""Defines the MedicalRecord model"""
import models
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship


class MedicalRecord(BaseModel, Base):
    """Blueprint for medicalrecord"""
    if models.storage_type == "db":
        __tablename__ = 'medical_records'
        appointment_id = Column(String(60), ForeignKey('appointments.id'), nullable=False)
        patient_id = Column(String(60), ForeignKey('patients.id'), nullable=False)
        doctor_id = Column(String(60), ForeignKey('doctors.id'), nullable=False)
        notes = Column(Text, nullable=True)
        prescriptions = Column(Text, nullable=True)

        patient = relationship("Patient", back_populates='medical_records')
        doctor = relationship("Doctor", back_populates='medical_records')

    else:
        appointment_id = ""
        patient_id = ""
        doctor_id = ""
        notes = ""
        prescriptions = ""

    def __init__(self, *args, **kwargs):
        """Initializes the MedicalRecord"""
        super().__init__(*args, **kwargs)

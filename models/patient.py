#!/usr/bin/python3
"""Defines the Patient Model"""
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import models
from datetime import datetime
from models.base_model import Base, BaseModel

class Patient(BaseModel, Base):
    """Patient Blueprint"""
    if models.storage_type == "db":
        __tablename__ = "patients"
        first_name = Column(String(128), nullable=False)
        last_name = Column(String(128), nullable=False)
        phone_number = Column(String(128), nullable=False)
        email = Column(String(128), nullable=False)
        insurance_number = Column(String(128), unique=True, nullable=False)
        insurance_provider = Column(String(128), nullable=True)
        user_id = Column(String(128), ForeignKey('users.id'), nullable=False)

        user = relationship('User', back_populates='patients')
        appointments = relationship('Appointment', back_populates='patient')
        medical_records = relationship('MedicalRecord', back_populates='patient')

    else:
        first_name = ""
        last_name = ""
        phone_number = ""
        email = ""
        insurance_number = ""
        insurance_provider = ""
        user_id = ""

    def __init__(self, *args, **kwargs):
        """initializes the current patient instance"""
        super().__init__(*args, **kwargs)

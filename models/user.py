#!/usr/bin/python3
"""Defines the user model"""
import models
from models.base_model import BaseModel, Base
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    """User model class"""
    if models.storage_type == "db":
        __tablename__ = 'users'
        name = Column(String(128), nullable=False)
        email = Column(String(128), unique=True, nullable=False)
        password = Column(String(128), nullable=False)
        role = Column(Enum('patient', 'doctor', 'admin', name='user_roles'), nullable=False)

        patients = relationship('Patient', back_populates='user', uselist=False)
        doctors = relationship('Doctor', back_populates='user', uselist=False)

    else:
        name = ""
        email = ""
        password = ""
        role = ""
    
    def __init__(self, *args, **kwargs):
        """Initializes the User"""
        super().__init__(*args, **kwargs)

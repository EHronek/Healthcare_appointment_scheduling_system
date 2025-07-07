#!/usr/bin/python3
"""Defines the user model"""
import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
import bcrypt


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

    def _hash_password(self, password):
        """
        hashes a password securely using bcrypt
        """
        password_bytes = password.encode('utf-8')

        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)

        return hashed.decode('utf-8')
    
    def check_password(self, password):
        """Checks if a given password matched the stored hashed password"""
        password_bytes = password.encode('utf-8')
        stored_hash_bytes = self.password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, stored_hash_bytes)

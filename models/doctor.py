#!/usr/bin/python3
"""Defines the Doctor Model"""
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel
import models


class Doctor(BaseModel, Base):
    """Blueprint for doctor"""
    if models.storage_type == "db":
        pass
    
    else:
        pass
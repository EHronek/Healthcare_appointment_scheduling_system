#!/usr/bin/python3
"""Contains the DBStorage class"""
import models
from models.base_model import BaseModel, Base
from models.appointment import Appointment
from models.availability import Availability
from models.doctor import Doctor
from models.exception import Exception
from models.patient import Patient
from models.medical_record import MedicalRecord
from models.user import User
from os import getenv
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


class DBStorage:
    """interact with the mysql database"""

    classes = {
        "BaseModel": BaseModel,
        "Appointment": Appointment,
        "Availability": Availability,
        "Doctor": Doctor,
        "Patient": Patient,
        "Exception": Exception,
        "MedicalRecord": MedicalRecord,
        "User": User
    }

    __engine = None
    __session = None

    def __init__(self):
        """Instantiates a DBStorage object"""
        HMS_MYSQL_USER = getenv("HMS_MYSQL_USER")
        HMS_MYSQL_PWD = getenv("HMS_MYSQL_PWD")
        HMS_MYSQL_HOST = getenv("HMS_MYSQL_HOST")
        HMS_MYSQL_DB = getenv("HMS_MYSQL_DB")
        
        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.
                                      format(HMS_MYSQL_USER,
                                             HMS_MYSQL_PWD,
                                             HMS_MYSQL_HOST,
                                             HMS_MYSQL_DB), pool_pre_ping=True, echo=True)
        
    def all(self, cls=None):
        """
        Query on the current database session for all objects
        if No argument provided else ALL objects of provided class(cls)
        """
        data = {}
        if cls:
            if isinstance(cls, str):
                cls = self.classes.get(cls)
                if cls is None:
                    raise ValueError(f"Class {cls} is not valid model")
            
            if cls not in self.classes.values():
                raise ValueError(f"Class {cls} is not a valid model")
            
            if cls not in self.classes.values():
                raise ValueError(f"{cls} is not recognized")
            
            class_obj = self.__session.query(cls).all()
            for obj in class_obj:
                key = f"{obj.__class__.__name__}.{obj.id}"
                data[key] = obj
            
        else:
            for clas in self.classes.values():
                class_objs = self.__session.query(clas).all()
                for obj in class_objs:
                    key = f"{obj.__class__.__name__}.{obj.id}"
                    data[key] = obj
        return data
    
    def new(self, obj):
        """Add the current object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current db session"""
        self.__session.commit()

    def get(self, cls, id):
        """Returns  objects based on the class and its ID or None if not Found"""
        all_classes = self.all(cls)

        for obj in all_classes.values():
            if id == str(obj.id):
                return obj
        return None
    
    def count(self, cls=None):
        """Count of how many instances of a classes there are"""
        return len(self.all(cls))
    
    def find(self, cls=None, id=None):
        """Finds a user in the db and returns a bolean"""
        if cls is not None or id is not None:
            all_classes = self.all(cls).values()

            for obj in all_classes:
                if obj.id == id:
                    return True
            return False

    
    def check_user(self, cls=None, email=None):
        """
        Finds the User in the db based on the email to search for
        and returns a boolean
        """
        if cls is not None or email is not None:
            all_classes = self.all(cls).values()

            for user in all_classes:
                if user.email == email:
                    return True
            return False

    def get_user_by_email(self, email):
        """Gets and return a user"""
        if email is not None:
            all_users = self.all(User).values()

            for user in all_users:
                if user.email == email:
                    return user
            return None
        
    def delete(self, obj=None):
        """Deletes current object from the database session"""
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        """reloads data from the database"""
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session

    def get_session(self):
        """Returns the current session"""
        return self.__session
    
    def close(self):
        """call remove() method on the private session attribute"""
        self.__session.remove()

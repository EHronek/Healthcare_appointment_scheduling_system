#!/usr/bin/python3
"""Contains the FileStorage class"""
import json
import models
from models.base_model import BaseModel
from models.appointment import Appointment
from models.availability import Availability
from models.doctor import Doctor
from models.exception import Exception
from models.patient import Patient
from models.medical_record import MedicalRecord
from models.user import User

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

class FileStorage:
    """Serializes instances to a JSON file & deserializes back to instances"""
    __file_path = "file.json"
    __objects = {}

    def all(self, cls=None):
        """
        Return the list of all objects of one type of class
        returns all objects if no argument is provided
        """
        if cls is not None:
            if isinstance(cls, str):
                cls = classes.get(cls)
            if cls not in classes.values():
                raise ValueError(f"invalid class name: {cls}")
            new_dict = {}
            for key, value in self.__objects.items():
                if cls == value.__class__ or cls == value.__class__.__name__:
                    new_dict[key] = value
            return new_dict
        return self.__objects
    
    def new(self, obj):
        """ Sets in __objects the obj with key <obj class name>.id """
        key = f"{obj.__class__.__name__}.{obj.id}"
        self.__objects[key] = obj

    def save(self):
        """serializes __objects to json file (path: __file_path)"""
        try:
            with open(self.__file_path, 'w') as file:
                json.dump({k: v.to_dict() for k, v in self.__objects.items()}, file)
        except Exception as e:
            print(f"Error saving file. \n{e}")

    def reload(self):
        """Deserializes the json file to __objects"""
        try:
            with open(self.__file_path, 'r') as f:
                data = json.load(f)
            for key in data:
                self.__objects[key] = classes[data[key]["__class__"]](**data[key])
        
        except FileNotFoundError:
            print("File not found")
        except KeyError as e:
            print(f"Missing class definition for {e}")
        except json.JSONDecodeError:
            print("Corrupted JSON file. Unable to reload")

    def delete(self, obj=None):
        """Deletes obj from __objects if it is inside"""
        if obj is not None:
            key = obj.__class__.__name__ + "." + obj.id
            if key in self.__objects:
                del self.__objects[key]
        else:
            print(f"Can't delete {obj}")

    def close(self):
        """Call reload() method for deserializing the json file to objects"""
        self.reload()

    def get(self, cls, id):
        """
        Returns the object based on the class name and ID
        or None if not found
        """
        if cls not in classes.values():
            return None
        
        all_classes = models.storage.all(cls)
        for value in all_classes.values():
            if (value.id == id):
                return value
        return None
    
    def count(self, cls=None):
        """
        Counts the number of objects in storage
        """
        all_classes = classes.values()
        if not cls:
            count = 0
            for clas in all_classes:
                count += len(models.storage.all(clas).values())
        else:
            count = len(models.storage.all(cls).values())

        return count


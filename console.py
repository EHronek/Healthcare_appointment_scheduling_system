#!/usr/bin/python3
"""
Console for my Healthcare application
Manages objects using customized command line inputs
"""
import shlex
import cmd
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

class HMSCommand(cmd.Cmd):
    """HMS Console"""
    prompt = '(HMS_$) '

    def do_EOF(self, arg):
        """Exits the console"""
        return True
    
    def emptyline(self):
        """Overwriting the empty line method"""
        return False
    
    def do_quit(self, arg):
        """Quit command to exit the console"""
        return True
    
    def _key_value_parser(self, args):
        """Create a dictionary from a list of strings"""
        new_dict = {}
        for arg in args:
            if "=" in args:
                kvp = arg.split('=', 1)
                key = kvp[0]
                value = kvp[1]
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1].replace("_", " ")

                else:
                    try:
                        value = int(value)
                    except ValueError:
                        try:
                            value = float(value)
                        except ValueError:
                            continue
                new_dict[key] = value
        return new_dict
    
    def do_create(self, arg):
        """
        Creates a new instance of a given class, sets attributes if provided,
        saves the instance, and prints the instance ID

        Usage:
            create ClassName key1=value1 key2="value with spaces"...
        """
        if not arg:
            print("** class name missing **")
            return
        
        args = shlex.split(arg)
        class_name = args[0]

        if class_name not in classes:
            print("** class doesn't exist **")
            return
        
        new_instance = classes[class_name]() 

        for param in args[1:]:
            if "=" in param:
                key, value = param.split("=", 1)

                if value.isdigit():
                    value = int(value)
                else:
                    try:
                        value = float(value)
                    except ValueError:
                        value = value.replace("_", " ")

                if isinstance(new_instance, User):
                    if key == "password":
                        value=new_instance._hash_password(value)

                setattr(new_instance, key, value)
        new_instance.save()
        print(new_instance.id)

    def do_show(self, arg):
        """Prints an instance as a string based on the class and ID"""
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
            return False
        
        class_name = args[0]
        if class_name not in classes:
            print("** class doesn't exist **")
            return False
        
        if len(args) < 2:
            print("** instance id missing **")
            return False
        
        obj_id = args[1]
        obj = models.storage.get(classes[class_name], obj_id)

        if obj:
            print(obj)
        else:
            print("** no instance found **")

    def do_destroy(self, arg):
        """Deletes an instance based on class name and ID"""
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
        elif args[0] in classes:
            if len(args) > 1:
                key = args[0] + "." + args[1]
                if key in models.storage.all():
                    models.storage.all().pop(key)
                    models.storage.save()
                else:
                    print("** no instance found **")
            else:
                print("** instance id missing **")
        else:
            print("** class doesn't exist **")

    def do_all(self, arg):
        """prints a string representation of instances"""
        args = shlex.split(arg)
        obj_list = []
        if len(args) == 0:
            obj_dict = models.storage.all()
        elif args[0] in classes:
            obj_dict = models.storage.all(classes[args[0]])
        else:
            print("** class doesn't exist **")
            return False
        for key in obj_dict:
            obj_list.append(str(obj_dict[key]))
        print("[", end='')
        print(", ".join(obj_list), end='')
        print("]")

    def do_update(self, arg):
        """Update an instance based on the class name, id, attractive & value"""
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class missing **")
        elif args[0] in classes:
            if len(args) > 1:
                key = args[0] + "." + args[1]
                if key in models.storage.all():
                    if len(args) > 2:
                        if len(args) > 3:
                            if args[0] in classes:
                                setattr(models.storage.all()[key], args[2], args[3])
                                models.storage.all()[key].save()
                        else:
                            print("** value missing **")

                    else:
                        print("** attribute name missing **")
                else:
                    print("** no instance found **")
            else:
                print("** instance id missing **")
        else:
            print("** class doesn't exist **")
                  

if __name__ == "__main__":
    HMSCommand().cmdloop()

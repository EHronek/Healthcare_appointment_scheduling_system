# 🩺 Healthcare Appointment Scheduling System

A robust and secure backend system built with **Python**, **Flask**, and **SQLAlchemy ORM** for managing appointments, doctors, patients, and medical records in a healthcare setting. Designed with modularity, scalability, and real-world usability in mind, this system features RESTful APIs, role-based authentication, and a powerful command-line interface (CLI) for managing objects and the entire application lifecycle.

---

# ⚙️ System Architecture

### 🧩 Components

Backend: Flask + SQLAlchemy ORM

Database: MySQL

Auth: OAuth 2.0 (Google), JWT

Frontend: (Optional) React or basic HTML/CSS/JS

---

## 🚀 Features

- 🧠 **Modular Object-Oriented Architecture**
- 🔐 **OAuth 2.0 Integration** — Authenticate users via third-party providers and auto-register them in the database as a system user with name, email and default role as a patient.
- 🔑 **Role-Based Access Control (RBAC)** — Enforced using JWT tokens for secure API access.
- 🩺 **Doctor & Patient Management** — Securely manage records and interactions with other entities effeciently.
- 📅 **Appointment Scheduling System** — Avoid conflicts with real-time doctor availability management.
- 📄 **Medical Record Handling** — Manage confidential medical histories efficiently and only accessible to patient and doctor sharing a common appointment.
- ⚙️ **Custom CLI Tool** (`console.py`) — Full CRUD capabilities via terminal for all models.
- 🔁 **Dynamic Environment Config** — Secure loading of DB credentials and secrets from environment variables.
- 🧱 **Storage Engine Abstraction** — Clean separation of database logic with `db_storage.py` and `file_storage.py`.

---

## 🧠 Project Architecture

healthcare-scheduler/ ├── api/ │ └── v1/ │ ├── routes/ │ └── app.py ├── auth/ │ ├── oauth.py │ └── jwt_handler.py ├── config/ │ └── env.py ├── console.py ├── models/ │ ├── base_model.py │ ├── doctor.py │ ├── patient_record.py │ ├── appointments.py │ ├── availability.py │ ├── exception.py │ ├── medical_record.py │ └── engine/ │ ├── db_storage.py │ └── file_storage.py ├── requirements.txt └── README.md

---

## 🧩 Core Models

| Model           | Description                                                                        |
| --------------- | ---------------------------------------------------------------------------------- |
| `BaseModel`     | Parent class for all models (includes ID, timestamps, save/delete logic, to_dict). |
| `Doctor`        | Stores profile data and working availability.                                      |
| `Patient`       | Tracks patient details and links to medical records.                               |
| `Appointments`  | Manages scheduled meetings between doctors and patients.                           |
| `Availability`  | Defines when doctors are available for appointments.                               |
| `MedicalRecord` | Stores confidential medical history of patients linked to an appointment.          |
| `Exception`     | Handles scheduling edge cases (e.g. doctor out-of-office).                         |

---

## 🧠 Storage Engine Design

The `models/engine/` directory abstracts all database logic:

- `db_storage.py`:
  - Defines reusable methods like `.all()`, `.get()`, `.new()`, `.save()`, `.delete()`, `.count()`, `.find()`, `.check_user()`, `.get_user_by_email()`, `.reload()`, `.get_session()`, `.close()` etc.
  - Manages the SQLAlchemy session and engine instance.
  - Fetches database credentials securely from environment variables.
- `file_storage.py`:
  - Placeholder for future JSON-based storage support.

This design eliminates repetitive CRUD logic and promotes cleaner code throughout the project.

---

## 💻 Command Line Interface — `console.py`

A powerful terminal-based CLI for developers to interact with the system’s data:
Allows quick management (create, update, destroy, etc) objects via a console / command interpreter in the Backend
store and persist objects to a file (JSON file)

### **`NOTE`** PROTOTYPE STILL INCOMPLETE

## Sample Commands to CRUD an object:

```bash
$ ./console.py
(HMS_$)
(HMS_$)

# Create a doctor
(HMS $) all MyModel
** class doesn't exist **
(HMS $) show BaseModel
** instance id missing **
(HMS $) show BaseModel My_First_Model
** no instance found **
(HMS $) create BaseModel
49faff9a-6318-451f-87b6-910505c55907
(HMS $) all BaseModel
["[BaseModel] (49faff9a-6318-451f-87b6-910505c55907) {'created_at': datetime.datetime(2017, 10, 2, 3, 10, 25, 903293), 'id': '49faff9a-6318-451f-87b6-910505c55907', 'updated_at': datetime.datetime(2017, 10, 2, 3, 10, 25, 903300)}"]
(HMS $) show BaseModel 49faff9a-6318-451f-87b6-910505c55907
[BaseModel] (49faff9a-6318-451f-87b6-910505c55907) {'created_at': datetime.datetime(2017, 10, 2, 3, 10, 25, 903293), 'id': '49faff9a-6318-451f-87b6-910505c55907', 'updated_at': datetime.datetime(2017, 10, 2, 3, 10, 25, 903300)}
(HMS $) destroy
** class name missing **
(HMS $) update BaseModel 49faff9a-6318-451f-87b6-910505c55907 first_name "Betty"
(HMS $) show BaseModel 49faff9a-6318-451f-87b6-910505c55907
[BaseModel] (49faff9a-6318-451f-87b6-910505c55907) {'first_name': 'Betty', 'id': '49faff9a-6318-451f-87b6-910505c55907', 'created_at': datetime.datetime(2017, 10, 2, 3, 10, 25, 903293), 'updated_at': datetime.datetime(2017, 10, 2, 3, 11, 3, 49401)}
(HMS $) create BaseModel
2dd6ef5c-467c-4f82-9521-a772ea7d84e9
(HMS $) all BaseModel
["[BaseModel] (2dd6ef5c-467c-4f82-9521-a772ea7d84e9) {'id': '2dd6ef5c-467c-4f82-9521-a772ea7d84e9', 'created_at': datetime.datetime(2017, 10, 2, 3, 11, 23, 639717), 'updated_at': datetime.datetime(2017, 10, 2, 3, 11, 23, 639724)}", "[BaseModel] (49faff9a-6318-451f-87b6-910505c55907) {'first_name': 'Betty', 'id': '49faff9a-6318-451f-87b6-910505c55907', 'created_at': datetime.datetime(2017, 10, 2, 3, 10, 25, 903293), 'updated_at': datetime.datetime(2017, 10, 2, 3, 11, 3, 49401)}"]
(HMS $) destroy BaseModel 49faff9a-6318-451f-87b6-910505c55907
(HMS $) show BaseModel 49faff9a-6318-451f-87b6-910505c55907
** no instance found **
(HMS $)
(HMS $) User.all()
[[User] (246c227a-d5c1-403d-9bc7-6a47bb9f0f68) {'first_name': 'Betty', 'last_name': 'Bar', 'created_at': datetime.datetime(2017, 9, 28, 21, 12, 19, 611352), 'updated_at': datetime.datetime(2017, 9, 28, 21, 12, 19, 611363), 'password': '63a9f0ea7bb98050796b649e85481845', 'email': 'airbnb@mail.com', 'id': '246c227a-d5c1-403d-9bc7-6a47bb9f0f68'}, [User] (38f22813-2753-4d42-b37c-57a17f1e4f88) {'first_name': 'Betty', 'last_name': 'Bar', 'created_at': datetime.datetime(2017, 9, 28, 21, 11, 42, 848279), 'updated_at': datetime.datetime(2017, 9, 28, 21, 11, 42, 848291), 'password': 'b9be11166d72e9e3ae7fd407165e4bd2', 'email': 'airbnb@mail.com', 'id': '38f22813-2753-4d42-b37c-57a17f1e4f88'}]
(HMS $)
(HMS $) User.count()
2
(HMS $)
(HMS $) User.show("246c227a-d5c1-403d-9bc7-6a47bb9f0f68")
[User] (246c227a-d5c1-403d-9bc7-6a47bb9f0f68) {'first_name': 'Betty', 'last_name': 'Bar', 'created_at': datetime.datetime(2017, 9, 28, 21, 12, 19, 611352), 'updated_at': datetime.datetime(2017, 9, 28, 21, 12, 19, 611363), 'password': '63a9f0ea7bb98050796b649e85481845', 'email': 'airbnb@mail.com', 'id': '246c227a-d5c1-403d-9bc7-6a47bb9f0f68'}
(HMS $) User.show("Bar")
** no instance found **

```

# 🔐 Authentication & Security

**OAuth 2.0 with Google for secure login**:

- Supports third-party login
- Auto-creates a new user in DB if not existing

# JWT-based RBAC:

- Protects API endpoints based on user roles (admin, doctor, patient)
- Validates access tokens for every secure operation
- CSRF protection for forms and crititcal endpoints

# Security Measures

- JWT token expiration + refresh flow
- Role-based access (admin, patient, doctor)
- CSRF tokens for form-based auth
- Input validation on all API endpoints

# API Documentation

This system provides a RESTful API for managing healthcare appointments, doctors, patients, availabilities, exceptions, and medical records.

### 🔐 Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the request header:

```http
Authorization: Bearer <your_jwt_token>
```

OAuth 2.0 is used for patient registration via Google login at `localhost:5000/login`.
System Admins and Doctors login to the system is via the api endpoint `localhost:5000/login-user`

### 🌐 Base URL

All endpoints are prefixed with:

```
http://localhost:5000/api/v1
```

### 📚 Endpoints Overview

| **RESOURCE** | **METHODS** | **DESCRIPTION**
|---------------------------------------------
| /appointments | GET, POST, PUT, DELETE | Manage appointments |
| /availabilities | GET, POST, PUT, DELETE | Manage doctor availability times |
| /doctors | GET, POST, PUT, DELETE | Manage doctor profiles |
| /patients | GET, POST, PUT, DELETE | Manage patient profiles |
| /exceptions | GET, POST, PUT, DELETE | Manage special date exceptions |
| /medical-records | GET, POST, PUT, DELETE | Manage patient medical records |
| /users | GET, POST, PUT, DELETE | Manage user accounts |

---

### 📋 Detailed Endpoints

**1. Appointments**

- GET /appointments
  Get all appointments (requires authentication)
- POST /appointments
  Create a new appointment

```json
{
  "doctor_id": "string",
  "patient_id": "string",
  "scheduled_time": "ISO8601 datetime",
  "status": "scheduled/cancelled/completed",
  "duration": "integer (minutes)"
}
```

- GET /appointments/<appointment_id>
  Get a specific appointment by ID
- PUT /appointments/<appointment_id>
  Update an existing appointment
- PUT /appointments/<appointment_id>/cancel
  Cancel an appointment
- PUT /appointments/<appointment_id>/complete
  Mark appointment as completed (doctor only)
- GET /appointments/available_slots
  Query available time slots for a doctor on a specific date
  Query parameters:
  - `doctor_id`
  - `date` (YYYY-MM-DD)

**2. Availabilities**

- GET /availabilities
  Get all availability entries
- GET /availabilities/<availability_id>
  Get a specific availability
- POST /availabilities
  Create a new availability

```json
{
  "doctor_id": "string",
  "day_of_week": "string",
  "start_time": "HH:MM:SS",
  "end_time": "HH:MM:SS"
}
```

- PUT /availabilities/<availability_id>
  Update an availability
- DELETE /availabilities/<availability_id>
  Delete an availability

**3. Doctors**

- GET /doctors
  Get all doctors
- GET /doctors/<doctor_id>
  Get a specific doctor
- POST /doctors
  Create a new doctor

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "specialization": "string"
}
```

- PUT /doctors/<doctor_id>
  Update a doctor
- DELETE /doctors/<doctor_id>
  Delete a doctor

4. Patients

- GET /patients
  Get all patients
- GET /patients/<patient_id>
  Get a specific patient
- POST /patients
  Create a new patient

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string"
}
```

- PUT /patients/<patient_id>
  Update a patient
- DELETE /patients/<patient_id>
  Delete a patient

**5. Exceptions**

- GET /exceptions
  Get all exception dates
- GET /exceptions/<exception_id>
  Get a specific exception
- POST /exceptions
  Create a new exception

```json
{
  "doctor_id": "string",
  "date": "YYYY-MM-DD",
  "is_available": true/false
}
```

- PUT /exceptions/<exception_id>
  Update an exception
- DELETE /exceptions/<exception_id>
  Delete an exception

**6. Medical Records**

- GET /medical-records
  Get all medical records
- GET /medical-records/<record_id>
  Get a specific medical record
- POST /medical-records
  Create a new medical record

```json
{
  "patient_id": "string",
  "appointment_id": "string",
  "record_data": "string"
}
```

- PUT /medical-records/<record_id>
  Update a medical record
- DELETE /medical-records/<record_id>
  Delete a medical record

#### 📎 Sample Request

Create Appointment

```bash
curl -X POST http://localhost:5000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
      "doctor_id": "0dd0a483-81f4-4d2c-abf3-dce880d54cad",
      "patient_id": "ee536037-78b5-4678-a19a-b0b0e14b0d69",
      "scheduled_time": "2025-08-20T14:30:00",
      "status": "scheduled",
      "duration": 30
  }'
```

#### ✅ Success Response Example

```json
{
  "id": "be1e7bc5-5fb5-4678-8f1d-28aaaba65c6d",
  "doctor_id": "0dd0a483-81f4-4d2c-abf3-dce880d54cad",
  "patient_id": "ee536037-78b5-4678-a19a-b0b0e14b0d69",
  "scheduled_time": "2025-08-20T14:30:00",
  "status": "scheduled",
  "duration": 30
}
```

#### ❌ Error Response Example

```json
{
  "error": "Time slot already booked"
}
```

# 🛠️ Setup & Usage

**✅ Environment Variables Required:**

```bash
$ export HMS_MYSQL_USER=database_username
$ export HMS_MYSQL_PWD=database_password
$ export HMS_MYSQL_HOST=localhost
$ export HMS_MYSQL_DB=database_name
$ export HMS_TYPE_STORAGE=db/fs
$ export JWT_SECRET_KEY="jwt_Secret_key"
$ export CLIENT_ID="google_api_client_id"
$ export CLIENT_SECRET="google_api_client_secret"
```

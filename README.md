# 🩺 Healthcare Appointment Scheduling System

A robust and secure backend system built with **Python**, **Flask**, and **SQLAlchemy ORM** for managing appointments, doctors, patients, and medical records in a healthcare setting. Designed with modularity, scalability, and real-world usability in mind, this system features RESTful APIs, role-based authentication, and a powerful command-line interface (CLI) for managing the entire application lifecycle.

---

## 🚀 Features

- 🧠 **Modular Object-Oriented Architecture**
- 🔐 **OAuth 2.0 Integration** — Authenticate users via third-party providers and auto-register them in the database.
- 🔑 **Role-Based Access Control (RBAC)** — Enforced using JWT tokens for secure API access.
- 🩺 **Doctor & Patient Management** — Securely manage records and interactions.
- 📅 **Appointment Scheduling System** — Avoid conflicts with real-time doctor availability management.
- 📄 **Medical Record Handling** — Manage confidential medical histories efficiently.
- ⚙️ **Custom CLI Tool** (`console.py`) — Full CRUD capabilities via terminal for all models.
- 🔁 **Dynamic Environment Config** — Secure loading of DB credentials and secrets from environment variables.
- 🧱 **Storage Engine Abstraction** — Clean separation of database logic with `db_storage.py` and `file_storage.py`.

---

## 🧠 Project Architecture

healthcare-scheduler/ ├── api/ │ └── v1/ │ ├── routes/ │ └── app.py ├── auth/ │ ├── oauth.py │ └── jwt_handler.py ├── config/ │ └── env.py ├── console.py ├── models/ │ ├── base_model.py │ ├── doctor.py │ ├── patient_record.py │ ├── appointments.py │ ├── availability.py │ ├── exception.py │ ├── medical_record.py │ └── engine/ │ ├── db_storage.py │ └── file_storage.py ├── requirements.txt └── README.md



---

## 🧩 Core Models

| Model            | Description |
|------------------|-------------|
| `BaseModel`       | Parent class for all models (includes ID, timestamps, save/delete logic). |
| `Doctor`          | Stores profile data and working availability. |
| `PatientRecord`   | Tracks patient details and links to medical records. |
| `Appointments`    | Manages scheduled meetings between doctors and patients. |
| `Availability`    | Defines when doctors are available for appointments. |
| `MedicalRecord`   | Stores confidential medical history of patients. |
| `Exception`       | Handles scheduling edge cases (e.g. doctor out-of-office). |

---

## 🧠 Storage Engine Design

The `models/engine/` directory abstracts all database logic:

- `db_storage.py`: 
  - Defines reusable methods like `.all()`, `.get()`, `.filter_by()`, `.save()`, `.delete()` etc.
  - Manages the SQLAlchemy session and engine instance.
  - Fetches database credentials securely from environment variables.
  
- `file_storage.py`:
  - Placeholder for future JSON-based storage support.

This design eliminates repetitive CRUD logic and promotes cleaner code throughout the project.

---

## 💻 Command Line Interface — `console.py`

A powerful terminal-based CLI for developers to interact with the system’s data:

```bash
$ python3 console.py

## Sample Commands :
# Create a doctor
create Doctor name="Dr.John" specialization="Dermatology"

# Show all appointments
all Appointment

# Update a patient record
update PatientRecord 1234-uuid name="Jane Doe"

# Delete a doctor
destroy Doctor 1234-uuid

# 🔐 Authentication & Security
OAuth 2.0:

Supports third-party login

Auto-creates a new user in DB if not existing

JWT-based RBAC:

Protects API endpoints based on user roles (admin, doctor, patient)

Validates access tokens for every secure operation




🛠️ Setup & Usage
✅ Environment Variables Required
Variable	Purpose
DB_USER	MySQL username
DB_PWD	MySQL password
DB_HOST	Host address (e.g. localhost)
DB_NAME	Database name





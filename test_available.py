from datetime import datetime, time, timedelta
from models.doctor import Doctor
from models.availability import Availability
from models.appointment import Appointment
from models.exception import Exception
from models import storage
from api.v1.helper_functions import is_doctor_available, validate_appointment_data

# Simulated constants
MIN_APPOINTMENT_DURATION = 15
MAX_APPOINTMENT_DURATION = 120



doctor_id = "0dd0a483-81f4-4d2c-abf3-dce880d54cad"
doctor = storage.get(Doctor, doctor_id)

# Prepare test input
future_time = datetime.now() + timedelta(days=2, hours=1)
working_start = time(9, 0)
working_end = time(17, 0)

# Run availability check
print("=== Test is_doctor_available ===")
available = is_doctor_available(
    doctor_id=doctor_id,
    start_time=future_time,
    duration=30,
    working_hours_start=working_start,
    working_hours_end=working_end
)
print(f"Is doctor available? {available}")

# Run appointment validation check
print("\n=== Test validate_appointment_data ===")
test_data = {
    "doctor_id": doctor_id,
    "scheduled_time": future_time.isoformat(),
    "duration": 30
}
validation_result = validate_appointment_data(test_data)
print("Validation errors:", validation_result)


# Test missing field
print("\n=== Test with missing fields ===")
test_data = {
    "doctor_id": doctor_id,
    "duration": 30
}
print("Validation errors:", validate_appointment_data(test_data))


# Test invalid duration format
print("\n=== Test invalid duration format ===")
test_data = {
    "doctor_id": doctor_id,
    "scheduled_time": future_time.isoformat(),
    "duration": "thirty"
}
print("Validation errors:", validate_appointment_data(test_data))


import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime, time, timedelta
from api.v1.helper_functions import is_doctor_available


class TestAvailabilityLogic(unittest.TestCase):
    @patch('models.storage')
    def test_doctor_not_found(self, mock_storage):
        mock_storage.get.return_value = None
        result = is_doctor_available("nonexistent", datetime.now(), 30, time(9), time(17))
        self.assertFalse(result)

    @patch('models.storage')
    def test_outside_working_hours(self, mock_storage):
        doctor = MagicMock()
        doctor.avaiilability = []
        doctor.exception = []
        mock_storage.get.return_value =doctor
        result = is_doctor_available("doc1", datetime.now().replace(hour=7), 30, time(9), time(17))
        self.assertFalse(result)

    @patch('models.storage')
    def test_no_availability_no_day(self, mock_storage):
        doctor = MagicMock()
        doctor.availability = []
        doctor.exceptions = []
        mock_storage.get.return_value = doctor
        result = is_doctor_available("doc1", datetime.now().replace(hour=10), 30, time(9), time(17))
        self.assertFalse(result)

    @patch('models.storage')
    def test_conflicting_appointment(self, mock_storage):
        doctor = MagicMock()
        doctor.availability = [MagicMock(day_of_week=datetime.now().strftime('%A'),
                                         start_time=time(9), end_time=time(17))]
        doctor.exceptions = []
        mock_storage.get.return_value = doctor
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.count.return_value = 1
        mock_storage.get_session.return_value = mock_session

        result = is_doctor_available("doc1", datetime.now().replace(hour=10), 30, time(9), time(17))
        self.assertFalse(result)

    @patch('models.storage')
    def test_successful_availability(self, mock_storage):
        doctor = MagicMock()
        doctor.availability = [MagicMock(day_of_week=datetime.now().strftime('%A'),
                                         start_time=time(9), end_time=time(17))]
        doctor.exceptions = []
        mock_storage.get.return_value = doctor
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.count.return_value = 0
        mock_storage.get_session.return_value = mock_session

        result = is_doctor_available("doc1", datetime.now().replace(hour=10), 30, time(9), time(17))
        self.assertTrue(result)

if __name__ == '__main__':
    unittest.main()

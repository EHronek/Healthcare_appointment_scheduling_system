
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { mockAppointments, mockUsers, mockPatients } from '@/data/mockData';
import { Calendar, Clock, User, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const { user } = useAuth();

  // Get doctor's appointments (assuming doctor ID 1)
  const doctorAppointments = mockAppointments.filter(apt => apt.doctor === 1);
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = doctorAppointments.filter(apt => 
    apt.appointment_date === today && apt.status === 'scheduled'
  );

  const upcomingAppointments = doctorAppointments.filter(apt => 
    new Date(apt.appointment_date) >= new Date() && apt.status === 'scheduled'
  );

  const getPatientName = (patientId: number) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      const patientUser = mockUsers.find(u => u.id === patient.user);
      return patientUser ? `${patientUser.first_name} ${patientUser.last_name}` : 'Unknown Patient';
    }
    return 'Unknown Patient';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Good morning, {user?.first_name} {user?.last_name}!
        </h1>
        <p className="opacity-90">You have {todaysAppointments.length} appointments scheduled for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{todaysAppointments.length}</p>
            <p className="text-sm text-gray-600">appointments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{upcomingAppointments.length}</p>
            <p className="text-sm text-gray-600">total scheduled</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              <Link to="/doctor/availability" className="flex items-center hover:text-purple-600">
                <Settings className="w-5 h-5 mr-2 text-purple-600" />
                Availability
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/doctor/availability">
              <Button variant="outline" size="sm" className="w-full">
                Update Schedule
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              <Link to="/doctor/medical-records" className="flex items-center hover:text-orange-600">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Records
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/doctor/medical-records">
              <Button variant="outline" size="sm" className="w-full">
                View Records
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your appointments for {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          {todaysAppointments.length > 0 ? (
            <div className="space-y-4">
              {todaysAppointments
                .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-semibold text-blue-900">{appointment.appointment_time}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="font-medium">{getPatientName(appointment.patient)}</span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{appointment.duration} min</span>
                    {appointment.notes && (
                      <span className="ml-4 italic">"{appointment.notes}"</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No appointments scheduled for today</p>
              <p className="text-sm text-gray-400 mt-2">Enjoy your day off!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Patient</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{getPatientName(appointment.patient)}</td>
                      <td className="p-3">{appointment.appointment_date}</td>
                      <td className="p-3">{appointment.appointment_time}</td>
                      <td className="p-3">{appointment.duration} min</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {appointment.notes || 'No notes'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

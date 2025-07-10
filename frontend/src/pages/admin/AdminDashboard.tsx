
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockUsers, mockDoctors, mockPatients, mockAppointments } from '@/data/mockData';
import { Users, Stethoscope, UserCheck, Calendar, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  // Calculate statistics
  const totalUsers = mockUsers.length;
  const totalDoctors = mockDoctors.length;
  const totalPatients = mockPatients.length;
  const totalAppointments = mockAppointments.length;

  const activeUsers = mockUsers.filter(user => user.is_active).length;
  const todaysAppointments = mockAppointments.filter(apt => 
    apt.appointment_date === new Date().toISOString().split('T')[0]
  ).length;

  const recentAppointments = mockAppointments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getDoctorName = (doctorId: number) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (doctor) {
      const doctorUser = mockUsers.find(u => u.id === doctor.user);
      return doctorUser ? `${doctorUser.first_name} ${doctorUser.last_name}` : 'Unknown Doctor';
    }
    return 'Unknown Doctor';
  };

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="opacity-90">System overview and management tools</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            <p className="text-sm text-gray-600">{activeUsers} active</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
              Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{totalDoctors}</p>
            <p className="text-sm text-gray-600">healthcare providers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-purple-600" />
              Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{totalPatients}</p>
            <p className="text-sm text-gray-600">registered patients</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{totalAppointments}</p>
            <p className="text-sm text-gray-600">{todaysAppointments} today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/admin/users" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove users</p>
            </Link>
            
            <Link to="/admin/doctors" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Stethoscope className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium">Manage Doctors</h3>
              <p className="text-sm text-gray-500">Doctor profiles and specializations</p>
            </Link>
            
            <Link to="/admin/patients" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <UserCheck className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium">Manage Patients</h3>
              <p className="text-sm text-gray-500">Patient records and insurance</p>
            </Link>
            
            <Link to="/admin/appointments" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-medium">View Appointments</h3>
              <p className="text-sm text-gray-500">System-wide appointment overview</p>
            </Link>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              System Health
            </CardTitle>
            <CardDescription>Key system metrics and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">System Status</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Sessions</span>
              <Badge variant="secondary">{activeUsers}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Today's Bookings</span>
              <Badge variant="secondary">{todaysAppointments}</Badge>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">99.9%</p>
                  <p className="text-xs text-gray-500">Uptime</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">0.2s</p>
                  <p className="text-xs text-gray-500">Response Time</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">5.2GB</p>
                  <p className="text-xs text-gray-500">Storage Used</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest appointment activity across the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Patient</th>
                    <th className="text-left p-3">Doctor</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{getPatientName(appointment.patient)}</td>
                      <td className="p-3">{getDoctorName(appointment.doctor)}</td>
                      <td className="p-3">{appointment.appointment_date}</td>
                      <td className="p-3">{appointment.appointment_time}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{appointment.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No recent appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Activity, Shield } from 'lucide-react';

const Index = () => {
  const { user, switchRole } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Healthcare Appointment System</h1>
          <p className="text-xl text-gray-600 mb-8">Streamlined healthcare management for patients, doctors, and administrators</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>For Patients</CardTitle>
                <CardDescription>Book appointments, view medical records, and manage your healthcare</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>For Doctors</CardTitle>
                <CardDescription>Manage availability, view appointments, and maintain patient records</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>For Administrators</CardTitle>
                <CardDescription>Oversee users, manage system settings, and view analytics</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, {user.first_name} {user.last_name}
        </h1>
        <p className="text-gray-600">
          You're currently viewing the system as a {user.role}. 
          Switch roles below to explore different perspectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle>Patient Portal</CardTitle>
            <CardDescription>
              Book appointments, view medical records, and manage your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => switchRole('patient')} 
              className="w-full"
              variant={user.role === 'patient' ? 'default' : 'outline'}
            >
              {user.role === 'patient' ? 'Current View' : 'Switch to Patient'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Activity className="w-8 h-8 text-green-600 mb-2" />
            <CardTitle>Doctor Portal</CardTitle>
            <CardDescription>
              Manage availability, appointments, and patient medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => switchRole('doctor')} 
              className="w-full"
              variant={user.role === 'doctor' ? 'default' : 'outline'}
            >
              {user.role === 'doctor' ? 'Current View' : 'Switch to Doctor'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Manage users, doctors, patients, and system-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => switchRole('admin')} 
              className="w-full"
              variant={user.role === 'admin' ? 'default' : 'outline'}
            >
              {user.role === 'admin' ? 'Current View' : 'Switch to Admin'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

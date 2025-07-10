
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export function Navigation() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              HealthCare Appointment Scheduling System
            </Link>
            <div className="space-x-4">
              <Button variant="outline">Login</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const getNavLinks = () => {
    const baseClass = "text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors";
    const activeClass = "text-blue-600 bg-blue-50";

    switch (user.role) {
      case 'patient':
        return [
          { path: '/patient/dashboard', label: 'Dashboard' },
          { path: '/patient/book-appointment', label: 'Book Appointment' },
          { path: '/patient/medical-records', label: 'Medical Records' },
          { path: '/patient/profile', label: 'Profile' },
        ];
      case 'doctor':
        return [
          { path: '/doctor/dashboard', label: 'Dashboard' },
          { path: '/doctor/availability', label: 'Availability' },
          { path: '/doctor/appointments', label: 'Appointments' },
          { path: '/doctor/medical-records', label: 'Medical Records' },
          { path: '/doctor/exceptions', label: 'Exceptions' },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/doctors', label: 'Doctors' },
          { path: '/admin/patients', label: 'Patients' },
          { path: '/admin/appointments', label: 'Appointments' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              HealthCare Appointment Scheduling System
            </Link>
            <div className="flex space-x-1">
              {getNavLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === link.path ? 'text-blue-600 bg-blue-50' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
            <span className="text-sm text-gray-600">
              {user.first_name} {user.last_name}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchRole('patient')}
                disabled={user.role === 'patient'}
              >
                Patient
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchRole('doctor')}
                disabled={user.role === 'doctor'}
              >
                Doctor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchRole('admin')}
                disabled={user.role === 'admin'}
              >
                Admin
              </Button>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockDoctors, mockUsers, mockAvailability } from '@/data/mockData';
import { useState } from 'react';
import { Stethoscope, Search, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDoctors() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  const filteredDoctors = mockDoctors.filter(doctor => {
    const doctorUser = mockUsers.find(u => u.id === doctor.user);
    if (!doctorUser) return false;
    
    const matchesSearch = 
      doctorUser.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorUser.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorUser.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getDoctorUser = (userId: number) => {
    return mockUsers.find(u => u.id === userId);
  };

  const getDoctorAvailabilityCount = (doctorId: number) => {
    return mockAvailability.filter(avail => avail.doctor === doctorId && avail.is_available).length;
  };

  const handleEditDoctor = (doctorId: number) => {
    console.log('Editing doctor:', doctorId);
    toast({
      title: "Edit Doctor",
      description: "Doctor editing functionality would be implemented here.",
    });
  };

  const handleDeleteDoctor = (doctorId: number, doctorName: string) => {
    console.log('Deleting doctor:', doctorId);
    toast({
      title: "Doctor Removed",
      description: `Dr. ${doctorName} has been removed from the system.`,
    });
  };

  const getSpecializationColor = (specialization: string) => {
    const colors = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Dermatology': 'bg-green-100 text-green-800',
      'Neurology': 'bg-blue-100 text-blue-800',
      'Pediatrics': 'bg-yellow-100 text-yellow-800',
      'Orthopedics': 'bg-purple-100 text-purple-800',
    };
    return colors[specialization as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Management</h1>
        <p className="text-gray-600">Manage healthcare providers and their specializations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
              Total Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{mockDoctors.length}</p>
            <p className="text-sm text-gray-600">healthcare providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Specializations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {new Set(mockDoctors.map(d => d.specialization)).size}
            </p>
            <p className="text-sm text-gray-600">unique specialties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {mockDoctors.filter(d => {
                const user = getDoctorUser(d.user);
                return user?.is_active;
              }).length}
            </p>
            <p className="text-sm text-gray-600">currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Availability Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {mockAvailability.filter(a => a.is_available).length}
            </p>
            <p className="text-sm text-gray-600">total time slots</p>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Doctors</CardTitle>
              <CardDescription>Manage doctor profiles, specializations, and availability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search doctors by name, email, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Doctors Table */}
          {filteredDoctors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Doctor</th>
                    <th className="text-left p-3">Specialization</th>
                    <th className="text-left p-3">License</th>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Availability</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => {
                    const doctorUser = getDoctorUser(doctor.user);
                    const availabilityCount = getDoctorAvailabilityCount(doctor.id);
                    
                    return doctorUser ? (
                      <tr key={doctor.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{doctorUser.first_name} {doctorUser.last_name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-3 h-3 mr-1" />
                              {doctorUser.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getSpecializationColor(doctor.specialization)}>
                            {doctor.specialization}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm font-mono">{doctor.license_number}</td>
                        <td className="p-3">
                          {doctorUser.phone ? (
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              {doctorUser.phone}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Not provided</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm">{availabilityCount} slots</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={doctorUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {doctorUser.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDoctor(doctor.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDoctor(doctor.id, `${doctorUser.first_name} ${doctorUser.last_name}`)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Stethoscope className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No doctors found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specializations Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Specializations Overview</CardTitle>
          <CardDescription>Distribution of doctors by specialization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...new Set(mockDoctors.map(d => d.specialization))].map((specialization) => {
              const count = mockDoctors.filter(d => d.specialization === specialization).length;
              return (
                <div key={specialization} className="bg-gray-50 p-4 rounded-lg text-center">
                  <Badge className={getSpecializationColor(specialization)} variant="secondary">
                    {specialization}
                  </Badge>
                  <p className="text-2xl font-bold mt-2 text-gray-900">{count}</p>
                  <p className="text-sm text-gray-500">
                    {count === 1 ? 'doctor' : 'doctors'}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

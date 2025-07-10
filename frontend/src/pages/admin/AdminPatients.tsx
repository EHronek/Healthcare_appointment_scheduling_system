
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockPatients, mockUsers } from '@/data/mockData';
import { useState } from 'react';
import { UserCheck, Search, Edit, Trash2, Mail, Phone, CreditCard, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPatients() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  const filteredPatients = mockPatients.filter(patient => {
    const patientUser = mockUsers.find(u => u.id === patient.user);
    if (!patientUser) return false;
    
    const matchesSearch = 
      patientUser.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientUser.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientUser.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.insurance_provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getPatientUser = (userId: number) => {
    return mockUsers.find(u => u.id === userId);
  };

  const handleEditPatient = (patientId: number) => {
    console.log('Editing patient:', patientId);
    toast({
      title: "Edit Patient",
      description: "Patient editing functionality would be implemented here.",
    });
  };

  const handleDeletePatient = (patientId: number, patientName: string) => {
    console.log('Deleting patient:', patientId);
    toast({
      title: "Patient Removed",
      description: `${patientName} has been removed from the system.`,
    });
  };

  const getInsuranceColor = (provider: string) => {
    const colors = {
      'Blue Cross Blue Shield': 'bg-blue-100 text-blue-800',
      'Aetna Health': 'bg-green-100 text-green-800',
      'Cigna': 'bg-purple-100 text-purple-800',
      'UnitedHealth': 'bg-orange-100 text-orange-800',
      'Kaiser Permanente': 'bg-red-100 text-red-800',
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Get unique insurance providers
  const insuranceProviders = [...new Set(mockPatients.map(p => p.insurance_provider))];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
        <p className="text-gray-600">Manage patient records and insurance information</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{mockPatients.length}</p>
            <p className="text-sm text-gray-600">registered patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Insurance Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{insuranceProviders.length}</p>
            <p className="text-sm text-gray-600">different providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {mockPatients.filter(p => {
                const user = getPatientUser(p.user);
                return user?.is_active;
              }).length}
            </p>
            <p className="text-sm text-gray-600">currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {mockPatients.filter(p => {
                const user = getPatientUser(p.user);
                if (!user) return false;
                const joinDate = new Date(user.date_joined);
                const thisMonth = new Date();
                thisMonth.setDate(1);
                return joinDate >= thisMonth;
              }).length}
            </p>
            <p className="text-sm text-gray-600">new patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Patients Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Patients</CardTitle>
              <CardDescription>Manage patient records, contact info, and insurance details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients by name, email, or insurance provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Patients Table */}
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Patient</th>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Insurance Provider</th>
                    <th className="text-left p-3">Insurance Number</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    const patientUser = getPatientUser(patient.user);
                    
                    return patientUser ? (
                      <tr key={patient.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{patientUser.first_name} {patientUser.last_name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-3 h-3 mr-1" />
                              {patientUser.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {patientUser.phone ? (
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              {patientUser.phone}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Not provided</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-blue-600" />
                            <Badge className={getInsuranceColor(patient.insurance_provider)}>
                              {patient.insurance_provider}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm font-mono">
                            <CreditCard className="w-3 h-3 mr-1 text-gray-400" />
                            {patient.insurance_number}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={patientUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {patientUser.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{patientUser.date_joined}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPatient(patient.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePatient(patient.id, `${patientUser.first_name} ${patientUser.last_name}`)}
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
              <UserCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No patients found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance Providers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Providers Overview</CardTitle>
          <CardDescription>Distribution of patients by insurance provider</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insuranceProviders.map((provider) => {
              const count = mockPatients.filter(p => p.insurance_provider === provider).length;
              const percentage = ((count / mockPatients.length) * 100).toFixed(1);
              
              return (
                <div key={provider} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getInsuranceColor(provider)}>
                      {provider}
                    </Badge>
                    <span className="text-sm text-gray-500">{percentage}%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-500">
                    {count === 1 ? 'patient' : 'patients'}
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

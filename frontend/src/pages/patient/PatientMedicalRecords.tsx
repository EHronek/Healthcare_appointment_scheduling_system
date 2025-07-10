
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockMedicalRecords, mockDoctors, mockUsers } from '@/data/mockData';
import { FileText, Download, Calendar, User } from 'lucide-react';

export default function PatientMedicalRecords() {
  // Get patient's medical records (assuming patient ID 1)
  const patientRecords = mockMedicalRecords.filter(record => record.patient === 1);

  const getDoctorName = (doctorId: number) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (doctor) {
      const doctorUser = mockUsers.find(u => u.id === doctor.user);
      return doctorUser ? `${doctorUser.first_name} ${doctorUser.last_name}` : 'Unknown Doctor';
    }
    return 'Unknown Doctor';
  };

  const getDoctorSpecialization = (doctorId: number) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    return doctor?.specialization || 'General';
  };

  const handleDownload = (recordId: number) => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading record:', recordId);
    alert('Download functionality would be implemented here');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
        <p className="text-gray-600">View your complete medical history and prescriptions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{patientRecords.length}</p>
            <p className="text-sm text-gray-600">medical records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Doctors Visited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {new Set(patientRecords.map(r => r.doctor)).size}
            </p>
            <p className="text-sm text-gray-600">different doctors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Latest Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {patientRecords.length > 0 ? 
                patientRecords.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())[0].date_created :
                'N/A'
              }
            </p>
            <p className="text-sm text-gray-600">most recent visit</p>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription>Complete history of your medical visits and treatments</CardDescription>
        </CardHeader>
        <CardContent>
          {patientRecords.length > 0 ? (
            <div className="space-y-4">
              {patientRecords
                .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
                .map((record) => (
                <Card key={record.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="font-semibold">{getDoctorName(record.doctor)}</span>
                          <Badge variant="secondary" className="ml-2">
                            {getDoctorSpecialization(record.doctor)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {record.date_created}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(record.id)}
                        className="flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-sm">{record.diagnosis}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Prescriptions</h4>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm">{record.prescriptions}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    </div>

                    {record.appointment && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Related to appointment #{record.appointment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No medical records found</p>
              <p className="text-sm text-gray-400 mt-2">Your medical records will appear here after your appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

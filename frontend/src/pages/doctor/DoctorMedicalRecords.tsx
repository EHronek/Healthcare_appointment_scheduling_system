
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { mockMedicalRecords, mockUsers, mockPatients, mockAppointments } from '@/data/mockData';
import { FileText, Plus, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DoctorMedicalRecords() {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [prescriptions, setPrescriptions] = useState<string>('');
  const { toast } = useToast();

  // Get doctor's medical records (assuming doctor ID 1)
  const doctorRecords = mockMedicalRecords.filter(record => record.doctor === 1);

  const getPatientName = (patientId: number) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      const patientUser = mockUsers.find(u => u.id === patient.user);
      return patientUser ? `${patientUser.first_name} ${patientUser.last_name}` : 'Unknown Patient';
    }
    return 'Unknown Patient';
  };

  const handleAddRecord = () => {
    if (!selectedPatient || !diagnosis || !notes) {
      toast({
        title: "Missing Information",
        description: "Please fill in patient, diagnosis, and notes fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API
    console.log('Adding medical record:', {
      patient: selectedPatient,
      appointment: selectedAppointment || null,
      diagnosis,
      notes,
      prescriptions,
    });

    toast({
      title: "Medical Record Added",
      description: "The medical record has been successfully saved.",
    });

    // Reset form
    setSelectedPatient('');
    setSelectedAppointment('');
    setDiagnosis('');
    setNotes('');
    setPrescriptions('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
        <p className="text-gray-600">Manage patient medical records and treatment history</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{doctorRecords.length}</p>
            <p className="text-sm text-gray-600">created by you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Patients Treated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {new Set(doctorRecords.map(r => r.patient)).size}
            </p>
            <p className="text-sm text-gray-600">unique patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Medical Record</DialogTitle>
                    <DialogDescription>
                      Add a new medical record for a patient
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Patient</label>
                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPatients.map((patient) => (
                              <SelectItem key={patient.id.toString()} value={patient.id.toString()}>
                                {getPatientName(patient.id)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Related Appointment (Optional)</label>
                        <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAppointments
                              .filter(apt => apt.doctor === 1 && selectedPatient && apt.patient === parseInt(selectedPatient))
                              .map((appointment) => (
                              <SelectItem key={appointment.id.toString()} value={appointment.id.toString()}>
                                {appointment.appointment_date} - {appointment.appointment_time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Diagnosis</label>
                      <Textarea
                        placeholder="Enter primary diagnosis..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Notes</label>
                      <Textarea
                        placeholder="Enter detailed consultation notes, observations, treatment plan..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prescriptions</label>
                      <Textarea
                        placeholder="Enter prescribed medications, dosages, instructions..."
                        value={prescriptions}
                        onChange={(e) => setPrescriptions(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddRecord} className="w-full">
                      Save Medical Record
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Medical Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Records Created by You</CardTitle>
          <CardDescription>Records you've created for your patients</CardDescription>
        </CardHeader>
        <CardContent>
          {doctorRecords.length > 0 ? (
            <div className="space-y-4">
              {doctorRecords
                .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
                .map((record) => (
                <Card key={record.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="w-5 h-5 mr-2 text-green-600" />
                          <span className="font-semibold">{getPatientName(record.patient)}</span>
                          {record.appointment && (
                            <Badge variant="secondary" className="ml-2">
                              Appointment #{record.appointment}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {record.date_created}
                        </div>
                      </div>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Treatment Notes</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm">{record.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No medical records created yet</p>
              <p className="text-sm text-gray-400 mt-2">Create your first medical record using the button above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

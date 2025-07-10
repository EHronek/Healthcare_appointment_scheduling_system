
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { mockAppointments, mockUsers, mockPatients } from '@/data/mockData';
import { Calendar, Clock, User, FileText, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DoctorAppointments() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [notes, setNotes] = useState<string>('');
  const [prescriptions, setPrescriptions] = useState<string>('');
  const { toast } = useToast();

  // Get doctor's appointments (assuming doctor ID 1)
  const doctorAppointments = mockAppointments.filter(apt => apt.doctor === 1);

  const filteredAppointments = doctorAppointments.filter(apt => 
    statusFilter === 'all' || apt.status === statusFilter
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
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = (appointmentId: number, newStatus: string) => {
    // In a real app, this would call an API
    console.log('Updating appointment status:', appointmentId, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus}.`,
    });
  };

  const handleAddMedicalRecord = () => {
    if (!selectedAppointment || !notes) {
      toast({
        title: "Missing Information",
        description: "Please provide notes for the medical record.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API
    console.log('Adding medical record:', {
      appointment: selectedAppointment.id,
      patient: selectedAppointment.patient,
      notes,
      prescriptions,
    });

    toast({
      title: "Medical Record Added",
      description: "The medical record has been successfully saved.",
    });

    // Reset form
    setNotes('');
    setPrescriptions('');
    setSelectedAppointment(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
        <p className="text-gray-600">Manage your appointments and update patient records</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{doctorAppointments.length}</p>
            <p className="text-sm text-gray-600">appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {doctorAppointments.filter(apt => apt.status === 'scheduled').length}
            </p>
            <p className="text-sm text-gray-600">upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {doctorAppointments.filter(apt => apt.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-600" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {doctorAppointments.filter(apt => {
                const appointmentDate = new Date(apt.appointment_date);
                const today = new Date();
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return appointmentDate >= today && appointmentDate <= weekFromNow;
              }).length}
            </p>
            <p className="text-sm text-gray-600">appointments</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Manage your appointment schedule and patient interactions</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length > 0 ? (
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
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments
                    .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
                    .map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{getPatientName(appointment.patient)}</td>
                      <td className="p-3">{appointment.appointment_date}</td>
                      <td className="p-3 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.appointment_time}
                      </td>
                      <td className="p-3">{appointment.duration} min</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600 max-w-32 truncate">
                        {appointment.notes || 'No notes'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Select onValueChange={(value) => handleUpdateStatus(appointment.id, value)}>
                            <SelectTrigger className="w-28">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Complete</SelectItem>
                              <SelectItem value="cancelled">Cancel</SelectItem>
                              <SelectItem value="no-show">No Show</SelectItem>
                            </SelectContent>
                          </Select>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Add Medical Record</DialogTitle>
                                <DialogDescription>
                                  Create a medical record for {getPatientName(appointment.patient)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Notes</label>
                                  <Textarea
                                    placeholder="Enter consultation notes, diagnosis, observations..."
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
                                <Button onClick={handleAddMedicalRecord} className="w-full">
                                  Save Medical Record
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No appointments found</p>
              <p className="text-sm text-gray-400 mt-2">
                {statusFilter === 'all' ? 'No appointments scheduled' : `No ${statusFilter} appointments`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

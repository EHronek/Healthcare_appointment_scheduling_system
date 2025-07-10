
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockAppointments, mockUsers, mockPatients, mockDoctors } from '@/data/mockData';
import { format } from 'date-fns';
import { CalendarIcon, Search, Download, Filter, Clock, User, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminAppointments() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date>();
  const { toast } = useToast();

  const filteredAppointments = mockAppointments.filter(appointment => {
    const patient = mockPatients.find(p => p.id === appointment.patient);
    const doctor = mockDoctors.find(d => d.id === appointment.doctor);
    const patientUser = patient ? mockUsers.find(u => u.id === patient.user) : null;
    const doctorUser = doctor ? mockUsers.find(u => u.id === doctor.user) : null;

    const matchesSearch = !searchTerm || 
      (patientUser && `${patientUser.first_name} ${patientUser.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctorUser && `${doctorUser.first_name} ${doctorUser.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || appointment.doctor.toString() === doctorFilter;
    const matchesDate = !dateFilter || appointment.appointment_date === format(dateFilter, 'yyyy-MM-dd');
    
    return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
  });

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
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting appointments as ${format.toUpperCase()}`);
    toast({
      title: "Export Started",
      description: `Exporting ${filteredAppointments.length} appointments as ${format.toUpperCase()}.`,
    });
  };

  // Calculate statistics
  const totalAppointments = mockAppointments.length;
  const todaysAppointments = mockAppointments.filter(apt => 
    apt.appointment_date === new Date().toISOString().split('T')[0]
  ).length;
  const scheduledAppointments = mockAppointments.filter(apt => apt.status === 'scheduled').length;
  const completedAppointments = mockAppointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Appointments</h1>
        <p className="text-gray-600">Global view of all appointments across the healthcare system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
            <p className="text-sm text-gray-600">all appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{todaysAppointments}</p>
            <p className="text-sm text-gray-600">scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{scheduledAppointments}</p>
            <p className="text-sm text-gray-600">upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-purple-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{completedAppointments}</p>
            <p className="text-sm text-gray-600">finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Filter, search, and export appointment data</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search patients or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {mockDoctors.map((doctor) => (
                  <SelectItem key={doctor.id.toString()} value={doctor.id.toString()}>
                    {getDoctorName(doctor.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                  className="pointer-events-auto"
                />
                <div className="p-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateFilter(undefined)}
                    className="w-full"
                  >
                    Clear Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredAppointments.length} of {totalAppointments} appointments</span>
            {(searchTerm || statusFilter !== 'all' || doctorFilter !== 'all' || dateFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDoctorFilter('all');
                  setDateFilter(undefined);
                }}
              >
                <Filter className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Appointments Table */}
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Patient</th>
                    <th className="text-left p-3">Doctor</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments
                    .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
                    .map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{getPatientName(appointment.patient)}</td>
                      <td className="p-3">{getDoctorName(appointment.doctor)}</td>
                      <td className="p-3">{appointment.appointment_date}</td>
                      <td className="p-3 flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {appointment.appointment_time}
                      </td>
                      <td className="p-3">{appointment.duration} min</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{appointment.created_at}</td>
                      <td className="p-3 text-sm text-gray-600 max-w-32 truncate">
                        {appointment.notes || 'No notes'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No appointments found</p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

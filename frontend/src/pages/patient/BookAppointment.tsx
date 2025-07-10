
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { mockDoctors, mockUsers, mockAvailability, mockExceptions } from '@/data/mockData';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function BookAppointment() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { toast } = useToast();

  // Get unique specializations
  const specializations = [...new Set(mockDoctors.map(d => d.specialization))];

  // Get doctors by specialization
  const doctorsBySpecialization = mockDoctors.filter(
    d => !selectedSpecialization || d.specialization === selectedSpecialization
  );

  // Get doctor info
  const getDoctorInfo = (doctorId: number) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (doctor) {
      const user = mockUsers.find(u => u.id === doctor.user);
      return user ? { name: `${user.first_name} ${user.last_name}`, ...doctor } : null;
    }
    return null;
  };

  // Get available time slots for selected doctor and date
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !selectedDoctor) return [];

    const doctorId = parseInt(selectedDoctor);
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 1=Monday, etc.
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0=Monday

    // Check if doctor is available on this day
    const availability = mockAvailability.find(
      a => a.doctor === doctorId && a.day_of_week === adjustedDayOfWeek && a.is_available
    );

    if (!availability) return [];

    // Check for exceptions on this date
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const exception = mockExceptions.find(
      e => e.doctor === doctorId && e.date === dateStr
    );

    if (exception && !exception.is_available) return [];

    // Generate time slots (simplified - every 30 minutes)
    const slots = [];
    const startHour = parseInt(availability.start_time.split(':')[0]);
    const endHour = parseInt(availability.end_time.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return slots;
  };

  const handleConfirmAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API
    console.log('Booking appointment:', {
      doctor: selectedDoctor,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
    });

    toast({
      title: "Appointment Booked!",
      description: `Your appointment has been scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
    });

    // Reset form
    setSelectedSpecialization('');
    setSelectedDoctor('');
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-600">Schedule your visit with our healthcare professionals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selection Form */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Select your preferred doctor and time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Specialization Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Specialization</label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Doctor</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor} disabled={!selectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsBySpecialization.map((doctor) => {
                    const info = getDoctorInfo(doctor.id);
                    return info ? (
                      <SelectItem key={doctor.id.toString()} value={doctor.id.toString()}>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {info.name} - {info.specialization}
                        </div>
                      </SelectItem>
                    ) : null;
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={!selectedDoctor}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6} // Disable past dates and weekends
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableTimeSlots().map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="flex items-center justify-center"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {time}
                  </Button>
                ))}
              </div>
              {selectedDate && selectedDoctor && getAvailableTimeSlots().length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No available time slots for this date</p>
              )}
            </div>

            <Button 
              onClick={handleConfirmAppointment} 
              className="w-full"
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
            >
              Confirm Appointment
            </Button>
          </CardContent>
        </Card>

        {/* Appointment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Summary</CardTitle>
            <CardDescription>Review your appointment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDoctor && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="font-medium">Doctor</span>
                </div>
                <p className="text-sm">{getDoctorInfo(parseInt(selectedDoctor))?.name}</p>
                <Badge variant="secondary" className="mt-1">
                  {getDoctorInfo(parseInt(selectedDoctor))?.specialization}
                </Badge>
              </div>
            )}

            {selectedDate && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
                  <span className="font-medium">Date</span>
                </div>
                <p className="text-sm">{format(selectedDate, 'PPPP')}</p>
              </div>
            )}

            {selectedTime && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  <span className="font-medium">Time</span>
                </div>
                <p className="text-sm">{selectedTime}</p>
                <p className="text-xs text-gray-500 mt-1">Duration: 30 minutes</p>
              </div>
            )}

            {!selectedDoctor && !selectedDate && !selectedTime && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Select appointment details to see summary</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

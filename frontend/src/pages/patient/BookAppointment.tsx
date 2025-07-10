import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/apiServices";

export default function BookAppointment() {
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch all doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.DoctorService.getAllDoctors();
        setDoctors(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load doctors",
          variant: "destructive",
        });
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchAvailableSlots = async () => {
        setLoading(true);
        try {
          const dateStr = format(selectedDate, "yyyy-MM-dd");
          const slots = await api.AppointmentService.getAvailableSlots(
            selectedDoctor,
            dateStr
          );
          setAvailableSlots(slots.available_slots || []);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load available time slots",
            variant: "destructive",
          });
          setAvailableSlots([]);
        } finally {
          setLoading(false);
        }
      };
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  // Get unique specializations
  const specializations = [...new Set(doctors.map((d) => d.specialization))];

  // Get doctors by specialization
  const doctorsBySpecialization = doctors.filter(
    (d) =>
      !selectedSpecialization || d.specialization === selectedSpecialization
  );

  const handleConfirmAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentData = {
        doctor_id: selectedDoctor,
        scheduled_time: `${format(
          selectedDate,
          "yyyy-MM-dd"
        )}T${selectedTime}:00`,
        duration: 30, // Default 30-minute appointment
      };

      const newAppointment = await api.AppointmentService.createAppointment(
        appointmentData
      );

      toast({
        title: "Appointment Booked!",
        description: `Your appointment has been scheduled for ${format(
          selectedDate,
          "PPP"
        )} at ${selectedTime}.`,
      });

      // Reset form
      setSelectedSpecialization("");
      setSelectedDoctor("");
      setSelectedDate(undefined);
      setSelectedTime("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Book an Appointment
        </h1>
        <p className="text-gray-600">
          Schedule your visit with our healthcare professionals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selection Form */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Select your preferred doctor and time slot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Specialization Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Specialization
              </label>
              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Doctor</label>
              <Select
                value={selectedDoctor}
                onValueChange={setSelectedDoctor}
                disabled={!selectedSpecialization || loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsBySpecialization.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {doctor.first_name} {doctor.last_name} -{" "}
                        {doctor.specialization}
                      </div>
                    </SelectItem>
                  ))}
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
                    disabled={!selectedDoctor || loading}
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
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              {loading ? (
                <div className="text-center py-4">
                  Loading available slots...
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const time = slot.start.split("T")[1].substring(0, 5);
                    return (
                      <Button
                        key={slot.start}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="flex items-center justify-center"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                      </Button>
                    );
                  })}
                </div>
              )}
              {selectedDate &&
                selectedDoctor &&
                availableSlots.length === 0 &&
                !loading && (
                  <p className="text-sm text-gray-500 mt-2">
                    No available time slots for this date
                  </p>
                )}
            </div>

            <Button
              onClick={handleConfirmAppointment}
              className="w-full"
              disabled={
                !selectedDoctor || !selectedDate || !selectedTime || loading
              }
            >
              {loading ? "Processing..." : "Confirm Appointment"}
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
                <p className="text-sm">
                  {doctors.find((d) => d.id === selectedDoctor)?.first_name}{" "}
                  {doctors.find((d) => d.id === selectedDoctor)?.last_name}
                </p>
                <Badge variant="secondary" className="mt-1">
                  {doctors.find((d) => d.id === selectedDoctor)?.specialization}
                </Badge>
              </div>
            )}

            {selectedDate && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
                  <span className="font-medium">Date</span>
                </div>
                <p className="text-sm">{format(selectedDate, "PPPP")}</p>
              </div>
            )}

            {selectedTime && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  <span className="font-medium">Time</span>
                </div>
                <p className="text-sm">{selectedTime}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Duration: 30 minutes
                </p>
              </div>
            )}

            {!selectedDoctor && !selectedDate && !selectedTime && (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Select appointment details to see summary
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, User, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import api from "@/api/apiServices";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // First get patient profile for current user
        const patientProfile = await api.PatientService.getMyPatientProfile();

        // Then get appointments for this patient
        const allAppointments = await api.AppointmentService.getAppointments();
        const patientAppointments = allAppointments.filter(
          (apt) => apt.patient_id === patientProfile.id
        );

        setAppointments(patientAppointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (apt) =>
      new Date(apt.scheduled_time) >= new Date() && apt.status === "scheduled"
  );

  const pastAppointments = appointments.filter(
    (apt) =>
      new Date(apt.scheduled_time) < new Date() || apt.status === "completed"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="opacity-90">
          Manage your healthcare appointments and records
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Book Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/patient/book-appointment">
              <Button className="w-full">Book New Appointment</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {upcomingAppointments.length}
            </p>
            <p className="text-sm text-gray-600">appointments scheduled</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/patient/medical-records">
              <Button variant="outline" className="w-full">
                View Records
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Doctor</th>
                    <th className="text-left p-3">Specialization</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => {
                    const appointmentDate = parseISO(
                      appointment.scheduled_time
                    );
                    return (
                      <tr
                        key={appointment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">
                          {appointment.doctor?.first_name}{" "}
                          {appointment.doctor?.last_name}
                        </td>
                        <td className="p-3">
                          {appointment.doctor?.specialization}
                        </td>
                        <td className="p-3">
                          {format(appointmentDate, "PPP")}
                        </td>
                        <td className="p-3 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(appointmentDate, "p")}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
              <Link to="/patient/book-appointment">
                <Button className="mt-4">Book Your First Appointment</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Your appointment history</CardDescription>
        </CardHeader>
        <CardContent>
          {pastAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Doctor</th>
                    <th className="text-left p-3">Specialization</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.slice(0, 5).map((appointment) => {
                    const appointmentDate = parseISO(
                      appointment.scheduled_time
                    );
                    return (
                      <tr
                        key={appointment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">
                          {appointment.doctor?.first_name}{" "}
                          {appointment.doctor?.last_name}
                        </td>
                        <td className="p-3">
                          {appointment.doctor?.specialization}
                        </td>
                        <td className="p-3">
                          {format(appointmentDate, "PPP")}
                        </td>
                        <td className="p-3 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(appointmentDate, "p")}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No past appointments
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

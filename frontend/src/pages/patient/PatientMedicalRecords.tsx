import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/apiServices";
import { useToast } from "@/components/ui/use-toast";

export default function PatientMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        // First get patient profile for current user
        const patientProfile = await api.PatientService.getMyPatientProfile();

        // Then get medical records for this patient
        const patientRecords = await api.MedicalRecordService.getPatientRecords(
          patientProfile.id
        );
        setRecords(patientRecords);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load medical records",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const handleDownload = async (recordId: string) => {
    try {
      // In a real app, this would generate and download a PDF
      const record = records.find((r) => r.id === recordId);
      if (record) {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(record, null, 2)], {
          type: "application/json",
        });
        element.href = URL.createObjectURL(file);
        element.download = `medical-record-${recordId}.json`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download record",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">Loading medical records...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medical Records
        </h1>
        <p className="text-gray-600">
          View your complete medical history and prescriptions
        </p>
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
            <p className="text-2xl font-bold text-blue-600">{records.length}</p>
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
              {new Set(records.map((r) => r.doctor_id)).size}
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
              {records.length > 0
                ? format(parseISO(records[0].created_at), "PPP")
                : "N/A"}
            </p>
            <p className="text-sm text-gray-600">most recent visit</p>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription>
            Complete history of your medical visits and treatments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="font-semibold">
                            {record.doctor?.first_name}{" "}
                            {record.doctor?.last_name}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {record.doctor?.specialization}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(parseISO(record.created_at), "PPP")}
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
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Notes
                        </h4>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-sm">{record.notes}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Prescriptions
                        </h4>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm">{record.prescriptions}</p>
                        </div>
                      </div>
                    </div>

                    {record.appointment_id && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Related to appointment #{record.appointment_id}
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
              <p className="text-sm text-gray-400 mt-2">
                Your medical records will appear here after your appointments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

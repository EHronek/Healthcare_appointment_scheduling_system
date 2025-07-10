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
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, CreditCard, Shield, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import api from "@/api/apiServices";

export default function PatientProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    insurance_provider: "",
    insurance_number: "",
  });

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // Try to get patient profile for current user
        const data = await api.PatientService.getMyPatientProfile();
        setPatientData(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || user.email || "",
          phone_number: data.phone_number || "",
          insurance_provider: data.insurance_provider || "",
          insurance_number: data.insurance_number || "",
        });
      } catch (error) {
        // If no patient exists, initialize form with user data
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
          first_name: user.name?.split(" ")[0] || "",
          last_name: user.name?.split(" ")[1] || "",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (patientData) {
        // Update existing patient
        const updatedPatient = await api.PatientService.updatePatient(
          patientData.id,
          formData
        );
        setPatientData(updatedPatient);
        toast({
          title: "Success",
          description: "Patient information updated successfully",
        });
      } else {
        // Create new patient
        const newPatient = await api.PatientService.createPatient({
          ...formData,
          user_id: user.id,
        });
        setPatientData(newPatient);
        toast({
          title: "Success",
          description: "Patient information created successfully",
        });
      }
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save patient information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        Please log in to view your profile.
      </div>
    );
  }

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-6">Loading patient data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Patient Profile
        </h1>
        <p className="text-gray-600">
          {patientData
            ? "View and manage your profile"
            : "Complete your patient registration"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      required
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">
                        {formData.first_name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      required
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">
                        {formData.last_name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      {formData.email || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    required
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      {formData.phone_number || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label>Account Status</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <Badge variant={user.is_active ? "default" : "destructive"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Insurance Information
              </CardTitle>
              <CardDescription>Your insurance coverage details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="insurance_provider">Insurance Provider</Label>
                {isEditing ? (
                  <Input
                    id="insurance_provider"
                    value={formData.insurance_provider}
                    onChange={(e) =>
                      handleInputChange("insurance_provider", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-3 bg-green-50 rounded-md flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">
                      {formData.insurance_provider || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="insurance_number">Insurance Number</Label>
                {isEditing ? (
                  <Input
                    id="insurance_number"
                    value={formData.insurance_number}
                    onChange={(e) =>
                      handleInputChange("insurance_number", e.target.value)
                    }
                    required
                  />
                ) : (
                  <div className="p-3 bg-blue-50 rounded-md flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-mono">
                      {formData.insurance_number || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {!isEditing && formData.insurance_provider && (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Insurance Coverage
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Preventive care covered at 100%</li>
                      <li>• Specialist visits: $30 copay</li>
                      <li>• Annual deductible: $1,500</li>
                      <li>• Out-of-pocket maximum: $6,000</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">
                      Benefits Status
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Deductible Met:</span>
                        <span className="font-medium ml-2">$450 / $1,500</span>
                      </div>
                      <div>
                        <span className="text-green-700">Out-of-pocket:</span>
                        <span className="font-medium ml-2">$750 / $6,000</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="lg:col-span-2 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form to original data
                    setFormData({
                      first_name: patientData?.first_name || "",
                      last_name: patientData?.last_name || "",
                      email: patientData?.email || user.email || "",
                      phone_number: patientData?.phone_number || "",
                      insurance_provider: patientData?.insurance_provider || "",
                      insurance_number: patientData?.insurance_number || "",
                    });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                {patientData ? "Edit Profile" : "Complete Registration"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { mockPatients } from '@/data/mockData';
import { User, Mail, Phone, CreditCard, Shield, Calendar } from 'lucide-react';

export default function PatientProfile() {
  const { user } = useAuth();

  // Get patient details (assuming patient ID 1)
  const patientData = mockPatients.find(p => p.user === user?.id);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile</h1>
        <p className="text-gray-600">View your personal and insurance information</p>
      </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm">{user.first_name}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm">{user.last_name}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="p-3 bg-gray-50 rounded-md flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="p-3 bg-gray-50 rounded-md flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{user.phone || 'Not provided'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <div className="p-3 bg-gray-50 rounded-md flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{user.date_joined}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <div className="p-3 bg-gray-50 rounded-md">
                <Badge variant={user.is_active ? "default" : "destructive"}>
                  {user.is_active ? 'Active' : 'Inactive'}
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
            {patientData ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  <div className="p-3 bg-green-50 rounded-md flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">{patientData.insurance_provider}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                  <div className="p-3 bg-blue-50 rounded-md flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-mono">{patientData.insurance_number}</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Insurance Coverage</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Preventive care covered at 100%</li>
                    <li>• Specialist visits: $30 copay</li>
                    <li>• Annual deductible: $1,500</li>
                    <li>• Out-of-pocket maximum: $6,000</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Benefits Status</h4>
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
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No insurance information on file</p>
                <p className="text-sm text-gray-400 mt-2">Please contact our office to update your insurance details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Your account security and privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Shield className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <h4 className="font-medium text-blue-900">HIPAA Compliant</h4>
                <p className="text-sm text-blue-700 mt-1">Your data is protected</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <User className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <h4 className="font-medium text-green-900">Verified Account</h4>
                <p className="text-sm text-green-700 mt-1">Identity confirmed</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Mail className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <h4 className="font-medium text-purple-900">Email Verified</h4>
                <p className="text-sm text-purple-700 mt-1">Communication secured</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

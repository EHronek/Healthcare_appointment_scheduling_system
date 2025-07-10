
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockAvailability } from '@/data/mockData';
import { Clock, Trash2, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DoctorAvailability() {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const { toast } = useToast();

  const daysOfWeek = [
    { value: '0', label: 'Monday' },
    { value: '1', label: 'Tuesday' },
    { value: '2', label: 'Wednesday' },
    { value: '3', label: 'Thursday' },
    { value: '4', label: 'Friday' },
    { value: '5', label: 'Saturday' },
    { value: '6', label: 'Sunday' },
  ];

  // Get doctor's availability (assuming doctor ID 1)
  const doctorAvailability = mockAvailability.filter(avail => avail.doctor === 1);

  const getDayName = (dayNumber: number) => {
    return daysOfWeek.find(day => parseInt(day.value) === dayNumber)?.label || 'Unknown';
  };

  const handleAddAvailability = () => {
    if (!selectedDay || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API
    console.log('Adding availability:', {
      day: selectedDay,
      startTime,
      endTime,
    });

    toast({
      title: "Availability Added",
      description: `Added availability for ${getDayName(parseInt(selectedDay))} from ${startTime} to ${endTime}.`,
    });

    // Reset form
    setSelectedDay('');
    setStartTime('');
    setEndTime('');
  };

  const handleDeleteAvailability = (id: number) => {
    // In a real app, this would call an API
    console.log('Deleting availability:', id);
    
    toast({
      title: "Availability Removed",
      description: "The availability slot has been removed.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Availability</h1>
        <p className="text-gray-600">Set your working hours and schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-green-600" />
              Add Availability
            </CardTitle>
            <CardDescription>Set your available hours for each day of the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Day of Week</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleAddAvailability} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </CardContent>
        </Card>

        {/* Current Schedule Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Weekly Overview
            </CardTitle>
            <CardDescription>Your current weekly schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {daysOfWeek.map((day) => {
                const dayAvailability = doctorAvailability.filter(
                  avail => avail.day_of_week === parseInt(day.value) && avail.is_available
                );
                
                return (
                  <div key={day.value} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{day.label}</span>
                    <div className="flex items-center space-x-2">
                      {dayAvailability.length > 0 ? (
                        dayAvailability.map((avail, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {avail.start_time} - {avail.end_time}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          Not available
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Availability Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Availability Settings</CardTitle>
          <CardDescription>Manage your existing availability slots</CardDescription>
        </CardHeader>
        <CardContent>
          {doctorAvailability.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Day</th>
                    <th className="text-left p-3">Start Time</th>
                    <th className="text-left p-3">End Time</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAvailability
                    .sort((a, b) => a.day_of_week - b.day_of_week)
                    .map((availability) => (
                    <tr key={availability.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{getDayName(availability.day_of_week)}</td>
                      <td className="p-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-green-600" />
                        {availability.start_time}
                      </td>
                      <td className="p-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-red-600" />
                        {availability.end_time}
                      </td>
                      <td className="p-3">
                        <Badge className={availability.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {availability.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAvailability(availability.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No availability set</p>
              <p className="text-sm text-gray-400 mt-2">Add your available hours to start accepting appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

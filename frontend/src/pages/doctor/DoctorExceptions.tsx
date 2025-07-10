
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockExceptions } from '@/data/mockData';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function DoctorExceptions() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const { toast } = useToast();

  // Get doctor's exceptions (assuming doctor ID 1)
  const doctorExceptions = mockExceptions.filter(exc => exc.doctor === 1);

  const handleAddException = () => {
    if (!selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API
    console.log('Adding exception:', {
      date: format(selectedDate, 'yyyy-MM-dd'),
      isAvailable,
      reason,
    });

    toast({
      title: "Exception Added",
      description: `Exception set for ${format(selectedDate, 'PPP')}.`,
    });

    // Reset form
    setSelectedDate(undefined);
    setIsAvailable(false);
    setReason('');
  };

  const handleDeleteException = (id: number) => {
    // In a real app, this would call an API
    console.log('Deleting exception:', id);
    
    toast({
      title: "Exception Removed",
      description: "The exception has been removed from your schedule.",
    });
  };

  const handleToggleException = (id: number, currentStatus: boolean) => {
    // In a real app, this would call an API
    console.log('Toggling exception:', id, !currentStatus);
    
    toast({
      title: "Exception Updated",
      description: `Availability status has been changed.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Exceptions</h1>
        <p className="text-gray-600">Manage unavailable dates and special availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Exception */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Set Exception Date
            </CardTitle>
            <CardDescription>Mark dates when you're unavailable or have special availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
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
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Available on this day?</label>
                <p className="text-xs text-gray-500">
                  Toggle to set if you're available or unavailable
                </p>
              </div>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
              <Textarea
                placeholder="e.g., Conference, Personal leave, Special clinic hours..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleAddException} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Exception
            </Button>
          </CardContent>
        </Card>

        {/* Exception Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Exception Summary
            </CardTitle>
            <CardDescription>Overview of your scheduled exceptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {doctorExceptions.filter(exc => !exc.is_available).length}
                  </p>
                  <p className="text-sm text-red-700">Unavailable Days</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {doctorExceptions.filter(exc => exc.is_available).length}
                  </p>
                  <p className="text-sm text-green-700">Special Available Days</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Next Exceptions</h4>
                <div className="space-y-2">
                  {doctorExceptions
                    .filter(exc => new Date(exc.date) >= new Date())
                    .slice(0, 3)
                    .map((exception) => (
                    <div key={exception.id} className="flex items-center justify-between text-sm">
                      <span>{exception.date}</span>
                      <Badge className={exception.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {exception.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  ))}
                  {doctorExceptions.filter(exc => new Date(exc.date) >= new Date()).length === 0 && (
                    <p className="text-blue-700 text-sm">No upcoming exceptions</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exceptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Schedule Exceptions</CardTitle>
          <CardDescription>Manage your exception dates and availability overrides</CardDescription>
        </CardHeader>
        <CardContent>
          {doctorExceptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Reason</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorExceptions
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((exception) => (
                    <tr key={exception.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{exception.date}</td>
                      <td className="p-3">
                        <Badge className={exception.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {exception.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {exception.reason || 'No reason provided'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Switch
                            checked={exception.is_available}
                            onCheckedChange={() => handleToggleException(exception.id, exception.is_available)}
                            size="sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteException(exception.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No schedule exceptions set</p>
              <p className="text-sm text-gray-400 mt-2">Add exceptions to manage days when you're unavailable or have special hours</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

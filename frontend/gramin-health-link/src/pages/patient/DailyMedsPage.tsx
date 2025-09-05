import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  Plus, 
  Clock, 
  CheckCircle, 
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  prescribedBy?: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  isCustom: boolean;
}

interface MedLog {
  medicationId: string;
  date: string;
  time: string;
  taken: boolean;
}

const DailyMedsPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      prescribedBy: 'Dr. Smith',
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      instructions: 'Take with food',
      isCustom: false
    },
    {
      id: '2',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      times: ['09:00'],
      startDate: '2024-01-10',
      instructions: 'Take with breakfast',
      isCustom: true
    }
  ]);

  const [medLogs, setMedLogs] = useState<MedLog[]>([
    {
      medicationId: '1',
      date: '2024-01-16',
      time: '08:00',
      taken: true
    }
  ]);

  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    times: '',
    instructions: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const addCustomMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.times) {
      toast.error('Please fill in required fields');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency || 'As needed',
      times: newMed.times.split(',').map(t => t.trim()),
      startDate: today,
      instructions: newMed.instructions,
      isCustom: true
    };

    setMedications([...medications, medication]);
    setNewMed({ name: '', dosage: '', frequency: '', times: '', instructions: '' });
    setShowAddForm(false);
    toast.success('Medication added successfully');
  };

  const toggleMedTaken = (medicationId: string, time: string) => {
    const logKey = `${medicationId}-${today}-${time}`;
    const existingLog = medLogs.find(log => 
      log.medicationId === medicationId && 
      log.date === today && 
      log.time === time
    );

    if (existingLog) {
      setMedLogs(medLogs.map(log => 
        log.medicationId === medicationId && log.date === today && log.time === time
          ? { ...log, taken: !log.taken }
          : log
      ));
    } else {
      setMedLogs([...medLogs, {
        medicationId,
        date: today,
        time,
        taken: true
      }]);
    }

    toast.success('Medication status updated');
  };

  const isMedTaken = (medicationId: string, time: string) => {
    return medLogs.some(log => 
      log.medicationId === medicationId && 
      log.date === today && 
      log.time === time && 
      log.taken
    );
  };

  const getTodaySchedule = () => {
    const schedule: Array<{medication: Medication, time: string, taken: boolean}> = [];
    
    medications.forEach(med => {
      med.times.forEach(time => {
        schedule.push({
          medication: med,
          time,
          taken: isMedTaken(med.id, time)
        });
      });
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const getCompletionRate = () => {
    const todaySchedule = getTodaySchedule();
    if (todaySchedule.length === 0) return 0;
    const taken = todaySchedule.filter(item => item.taken).length;
    return Math.round((taken / todaySchedule.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daily Medications</h1>
              <p className="text-gray-600">Track your medication schedule and adherence</p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {/* Today's Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Pill className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{getCompletionRate()}%</p>
                    <p className="text-sm text-gray-600">Today's Completion</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{getTodaySchedule().filter(s => s.taken).length}/{getTodaySchedule().length}</p>
                  <p className="text-sm text-gray-600">Medications Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Medication Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Medication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Medication Name</label>
                    <Input
                      placeholder="e.g., Aspirin"
                      value={newMed.name}
                      onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Dosage</label>
                    <Input
                      placeholder="e.g., 100mg"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <Input
                      placeholder="e.g., Twice daily"
                      value={newMed.frequency}
                      onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Times (comma separated)</label>
                    <Input
                      placeholder="e.g., 08:00, 20:00"
                      value={newMed.times}
                      onChange={(e) => setNewMed({...newMed, times: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instructions</label>
                  <Input
                    placeholder="e.g., Take with food"
                    value={newMed.instructions}
                    onChange={(e) => setNewMed({...newMed, instructions: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addCustomMedication}>Add Medication</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medication Tabs */}
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList>
              <TabsTrigger value="today">Today's Schedule</TabsTrigger>
              <TabsTrigger value="prescribed">Prescribed Medications</TabsTrigger>
              <TabsTrigger value="custom">Custom Medications</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Medication Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTodaySchedule().map((item, index) => (
                      <div key={`${item.medication.id}-${item.time}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.taken}
                            onCheckedChange={() => toggleMedTaken(item.medication.id, item.time)}
                            className="h-5 w-5"
                          />
                          <div>
                            <p className="font-medium">{item.medication.name} - {item.medication.dosage}</p>
                            <p className="text-sm text-gray-600">{item.medication.instructions}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{item.time}</span>
                          </div>
                          {item.taken && (
                            <Badge className="bg-green-100 text-green-800 mt-1">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Taken
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {getTodaySchedule().length === 0 && (
                      <p className="text-center text-gray-500 py-8">No medications scheduled for today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescribed">
              <div className="space-y-4">
                {medications.filter(med => !med.isCustom).map(medication => (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{medication.name}</h3>
                            <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
                            <p className="text-sm text-gray-500">Prescribed by: {medication.prescribedBy}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Prescribed</Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="font-medium">Times: </span>
                          <span>{medication.times.join(', ')}</span>
                        </div>
                        {medication.instructions && (
                          <div>
                            <span className="font-medium">Instructions: </span>
                            <span>{medication.instructions}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Duration: </span>
                          <span>{medication.startDate} {medication.endDate ? `to ${medication.endDate}` : '(Ongoing)'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <div className="space-y-4">
                {medications.filter(med => med.isCustom).map(medication => (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Pill className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{medication.name}</h3>
                            <p className="text-gray-600">{medication.dosage} • {medication.frequency}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Custom</Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="font-medium">Times: </span>
                          <span>{medication.times.join(', ')}</span>
                        </div>
                        {medication.instructions && (
                          <div>
                            <span className="font-medium">Instructions: </span>
                            <span>{medication.instructions}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DailyMedsPage;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Droplets, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VitalReading {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  bloodSugar: number;
  heartRate: number;
}

const VitalsMetricsPage: React.FC = () => {
  const [vitals, setVitals] = useState<VitalReading[]>([
    {
      id: '1',
      date: '2024-01-10',
      systolic: 120,
      diastolic: 80,
      bloodSugar: 95,
      heartRate: 72
    },
    {
      id: '2',
      date: '2024-01-11',
      systolic: 125,
      diastolic: 82,
      bloodSugar: 98,
      heartRate: 75
    },
    {
      id: '3',
      date: '2024-01-12',
      systolic: 130,
      diastolic: 85,
      bloodSugar: 102,
      heartRate: 78
    },
    {
      id: '4',
      date: '2024-01-13',
      systolic: 145,
      diastolic: 95,
      bloodSugar: 140,
      heartRate: 85
    }
  ]);

  const [newReading, setNewReading] = useState({
    systolic: '',
    diastolic: '',
    bloodSugar: '',
    heartRate: ''
  });

  const addReading = () => {
    if (!newReading.systolic || !newReading.diastolic || !newReading.bloodSugar || !newReading.heartRate) {
      toast.error('Please fill in all fields');
      return;
    }

    const reading: VitalReading = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      systolic: parseInt(newReading.systolic),
      diastolic: parseInt(newReading.diastolic),
      bloodSugar: parseInt(newReading.bloodSugar),
      heartRate: parseInt(newReading.heartRate)
    };

    setVitals([...vitals, reading]);
    setNewReading({ systolic: '', diastolic: '', bloodSugar: '', heartRate: '' });
    toast.success('Vitals recorded successfully');
  };

  const getLatestReading = () => vitals[vitals.length - 1];

  const checkForAlerts = () => {
    const latest = getLatestReading();
    const alerts = [];

    if (latest.systolic > 140 || latest.diastolic > 90) {
      alerts.push('High Blood Pressure detected');
    }
    if (latest.bloodSugar > 126) {
      alerts.push('High Blood Sugar detected');
    }
    if (latest.heartRate > 100 || latest.heartRate < 60) {
      alerts.push('Irregular Heart Rate detected');
    }

    return alerts;
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return { label: 'High', color: 'bg-red-100 text-red-800' };
    if (systolic >= 130 || diastolic >= 80) return { label: 'Elevated', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  const getSugarStatus = (sugar: number) => {
    if (sugar >= 126) return { label: 'High', color: 'bg-red-100 text-red-800' };
    if (sugar >= 100) return { label: 'Elevated', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  const chartData = vitals.map(reading => ({
    date: new Date(reading.date).toLocaleDateString(),
    bp: reading.systolic,
    sugar: reading.bloodSugar,
    heartRate: reading.heartRate
  }));

  const alerts = checkForAlerts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vitals Metrics</h1>
            <p className="text-gray-600">Track your daily health vitals and monitor trends</p>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Health Alert:</strong> {alerts.join(', ')}. Consider consulting a doctor.
              </AlertDescription>
            </Alert>
          )}

          {/* Add New Reading */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Record Today's Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Systolic BP</label>
                  <Input
                    type="number"
                    placeholder="120"
                    value={newReading.systolic}
                    onChange={(e) => setNewReading({...newReading, systolic: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Diastolic BP</label>
                  <Input
                    type="number"
                    placeholder="80"
                    value={newReading.diastolic}
                    onChange={(e) => setNewReading({...newReading, diastolic: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Blood Sugar</label>
                  <Input
                    type="number"
                    placeholder="95"
                    value={newReading.bloodSugar}
                    onChange={(e) => setNewReading({...newReading, bloodSugar: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Heart Rate</label>
                  <Input
                    type="number"
                    placeholder="72"
                    value={newReading.heartRate}
                    onChange={(e) => setNewReading({...newReading, heartRate: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={addReading} className="mt-4">
                Record Vitals
              </Button>
            </CardContent>
          </Card>

          {/* Current Stats */}
          {vitals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold">{getLatestReading().systolic}/{getLatestReading().diastolic}</p>
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <Badge className={getBPStatus(getLatestReading().systolic, getLatestReading().diastolic).color}>
                        {getBPStatus(getLatestReading().systolic, getLatestReading().diastolic).label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Droplets className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold">{getLatestReading().bloodSugar}</p>
                      <p className="text-sm text-gray-600">Blood Sugar (mg/dL)</p>
                      <Badge className={getSugarStatus(getLatestReading().bloodSugar).color}>
                        {getSugarStatus(getLatestReading().bloodSugar).label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold">{getLatestReading().heartRate}</p>
                      <p className="text-sm text-gray-600">Heart Rate (bpm)</p>
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bp" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Sugar Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Readings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vitals.slice(-5).reverse().map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{new Date(reading.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>BP: {reading.systolic}/{reading.diastolic}</span>
                      <span>Sugar: {reading.bloodSugar}</span>
                      <span>HR: {reading.heartRate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VitalsMetricsPage;
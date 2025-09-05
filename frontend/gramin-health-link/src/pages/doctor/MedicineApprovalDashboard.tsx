import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Pill,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

interface MedicineRequest {
  id: string;
  patientName: string;
  patientAge: number;
  illness: string;
  medicines: string[];
  pharmacistName: string;
  prescriptionImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  doctorNotes?: string;
}

const MedicineApprovalDashboard: React.FC = () => {
  const [requests, setRequests] = useState<MedicineRequest[]>([
    {
      id: '1',
      patientName: 'John Doe',
      patientAge: 35,
      illness: 'Fever and headache',
      medicines: ['Paracetamol 500mg', 'Ibuprofen 400mg'],
      pharmacistName: 'Dr. Smith Pharmacy',
      status: 'pending',
      submittedAt: '2024-01-16T10:30:00Z'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      patientAge: 28,
      illness: 'Cough and cold',
      medicines: ['Cough Syrup', 'Antihistamine', 'Vitamin C'],
      pharmacistName: 'City Pharmacy',
      status: 'pending',
      submittedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '3',
      patientName: 'Mike Johnson',
      patientAge: 42,
      illness: 'Back pain',
      medicines: ['Diclofenac 50mg', 'Muscle relaxant'],
      pharmacistName: 'Health Plus Pharmacy',
      status: 'approved',
      submittedAt: '2024-01-15T09:15:00Z',
      doctorNotes: 'Approved. Take with food to avoid stomach irritation.'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  const handleApproval = (requestId: string, status: 'approved' | 'rejected') => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status, doctorNotes: doctorNotes || undefined }
        : req
    ));
    
    setSelectedRequest(null);
    setDoctorNotes('');
    toast.success(`Request ${status} successfully`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const RequestCard = ({ request }: { request: MedicineRequest }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{request.patientName}</h3>
              <p className="text-sm text-gray-600">Age: {request.patientAge} • {new Date(request.submittedAt).toLocaleDateString()}</p>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-700">Illness: </span>
            <span>{request.illness}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Prescribed Medicines: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {request.medicines.map((medicine, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50">
                  <Pill className="h-3 w-3 mr-1" />
                  {medicine}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-700">Pharmacist: </span>
            <span>{request.pharmacistName}</span>
          </div>

          {request.doctorNotes && (
            <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
              <span className="font-medium text-green-800">Doctor's Notes: </span>
              <span className="text-green-700">{request.doctorNotes}</span>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="flex gap-2 pt-3 border-t">
              <Button
                onClick={() => setSelectedRequest(request.id)}
                variant="outline"
                size="sm"
              >
                Review
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Approval Dashboard</h1>
            <p className="text-gray-600">Review and approve patient medicine requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingRequests.length}</p>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{approvedRequests.length}</p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{rejectedRequests.length}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Tabs */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending requests</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </TabsContent>
          </Tabs>

          {/* Review Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Review Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add notes for the patient (optional)"
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproval(selectedRequest, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApproval(selectedRequest, 'rejected')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedRequest(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineApprovalDashboard;
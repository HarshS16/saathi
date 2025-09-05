import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle,
  Pill
} from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

interface MedicineRequest {
  id: string;
  patientName: string;
  illness: string;
  medicines: string[];
  pharmacistName: string;
  prescriptionImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  doctorNotes?: string;
}

const MedicineApprovalRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<MedicineRequest[]>([
    {
      id: '1',
      patientName: 'John Doe',
      illness: 'Fever and headache',
      medicines: ['Paracetamol 500mg', 'Ibuprofen 400mg'],
      pharmacistName: 'Dr. Smith Pharmacy',
      status: 'approved',
      submittedAt: '2024-01-15T10:30:00Z',
      doctorNotes: 'Approved. Take as prescribed.'
    },
    {
      id: '2',
      patientName: 'John Doe',
      illness: 'Cough and cold',
      medicines: ['Cough Syrup', 'Antihistamine'],
      pharmacistName: 'City Pharmacy',
      status: 'pending',
      submittedAt: '2024-01-16T14:20:00Z'
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    illness: '',
    medicines: '',
    pharmacistName: '',
    prescriptionImage: null as File | null
  });

  const submitRequest = () => {
    if (!newRequest.illness || !newRequest.medicines || !newRequest.pharmacistName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const request: MedicineRequest = {
      id: Date.now().toString(),
      patientName: 'John Doe', // Mock patient name
      illness: newRequest.illness,
      medicines: newRequest.medicines.split(',').map(m => m.trim()),
      pharmacistName: newRequest.pharmacistName,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      prescriptionImage: newRequest.prescriptionImage ? URL.createObjectURL(newRequest.prescriptionImage) : undefined
    };

    setRequests([request, ...requests]);
    setNewRequest({ illness: '', medicines: '', pharmacistName: '', prescriptionImage: null });
    toast.success('Medicine approval request submitted successfully');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Approval Request</h1>
            <p className="text-gray-600">Submit prescription for doctor approval</p>
          </div>

          {/* New Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Submit New Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Illness/Symptoms</label>
                <Textarea
                  placeholder="Describe your illness or symptoms..."
                  value={newRequest.illness}
                  onChange={(e) => setNewRequest({...newRequest, illness: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Prescribed Medicines</label>
                <Textarea
                  placeholder="Enter medicines separated by commas (e.g., Paracetamol 500mg, Cough Syrup)"
                  value={newRequest.medicines}
                  onChange={(e) => setNewRequest({...newRequest, medicines: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pharmacist/Pharmacy Name</label>
                <Input
                  placeholder="Enter pharmacist or pharmacy name"
                  value={newRequest.pharmacistName}
                  onChange={(e) => setNewRequest({...newRequest, pharmacistName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prescription Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewRequest({...newRequest, prescriptionImage: e.target.files?.[0] || null})}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label htmlFor="prescription-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload prescription image</span>
                  </label>
                  {newRequest.prescriptionImage && (
                    <p className="text-sm text-green-600 mt-2">File selected: {newRequest.prescriptionImage.name}</p>
                  )}
                </div>
              </div>

              <Button onClick={submitRequest} className="w-full">
                Submit Request
              </Button>
            </CardContent>
          </Card>

          {/* Previous Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Your Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{request.illness}</h3>
                        <p className="text-sm text-gray-600">Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Medicines: </span>
                        <span className="text-gray-700">{request.medicines.join(', ')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Pharmacist: </span>
                        <span className="text-gray-700">{request.pharmacistName}</span>
                      </div>
                      {request.doctorNotes && (
                        <div className="bg-blue-50 p-3 rounded">
                          <span className="font-medium">Doctor's Notes: </span>
                          <span className="text-gray-700">{request.doctorNotes}</span>
                        </div>
                      )}
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

export default MedicineApprovalRequestPage;
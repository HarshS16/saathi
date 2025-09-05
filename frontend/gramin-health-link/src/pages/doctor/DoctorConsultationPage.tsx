import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Video,
  Phone,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  User,
  Clock,
  FileText,
  Stethoscope,
  Users,
  Calendar,
  MessageCircle,
  Send
} from 'lucide-react';

const DoctorConsultationPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('waiting');
  const [isInCall, setIsInCall] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Mock WebRTC setup
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  useEffect(() => {
    // Mock appointments data for demo
    const mockAppointments = [
      {
        _id: '1',
        patient: { name: 'John Doe', age: 35, phone: '+91 9876543210' },
        time: '10:00 AM',
        status: 'waiting',
        type: 'consultation',
        symptoms: 'Fever and headache for 2 days'
      },
      {
        _id: '2',
        patient: { name: 'Jane Smith', age: 28, phone: '+91 9876543211' },
        time: '11:30 AM',
        status: 'confirmed',
        type: 'follow-up',
        symptoms: 'Follow-up for diabetes management'
      }
    ];
    
    setAppointments(mockAppointments);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800">Waiting</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="h-4 w-4" />;
      case 'follow-up':
        return <FileText className="h-4 w-4" />;
      case 'checkup':
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const startMeeting = async (appointment) => {
    setCurrentAppointment(appointment);
    setIsInCall(true);
    
    // Initialize WebRTC
    try {
      // Get user media
      localStream.current = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = localStream.current;
      }
      
      // In a real implementation, we would set up the peer connection here
      // For this demo, we'll just simulate the connection
      console.log("WebRTC connection initialized for appointment:", appointment._id);
      
      // Add a welcome message
      setMessages([{
        id: 1,
        sender: 'system',
        text: 'Connection established with patient',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera or microphone. Please check permissions.");
    }
  };

  const endCall = () => {
    // Stop local stream
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear video elements
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsInCall(false);
    setCurrentAppointment(null);
    setMessages([]);
  };

  const toggleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        id: messages.length + 1,
        sender: 'doctor',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (isInCall && currentAppointment) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Call Header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={endCall}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">Consultation with {currentAppointment.patient.name}</h2>
              <p className="text-sm text-gray-300">In progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleAudio}
              className={isAudioMuted ? "bg-red-500 hover:bg-red-600" : "hover:bg-gray-700"}
            >
              {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleVideo}
              className={isVideoMuted ? "bg-red-500 hover:bg-red-600" : "hover:bg-gray-700"}
            >
              {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex flex-col md:flex-row h-[calc(100vh-150px)]">
          {/* Local Video */}
          <div className="w-full md:w-2/3 p-4">
            <div className="bg-black rounded-lg h-full flex items-center justify-center relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                You
              </div>
            </div>
          </div>

          {/* Remote Video / Chat */}
          <div className="w-full md:w-1/3 p-4 flex flex-col gap-4">
            {/* Remote Video */}
            <div className="bg-black rounded-lg h-2/3 flex items-center justify-center relative">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                {currentAppointment.patient.name}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-gray-800 rounded-lg flex-1 flex flex-col">
              <div className="p-3 border-b border-gray-700 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h3 className="font-semibold">Chat</h3>
              </div>
              <div 
                ref={chatContainerRef}
                className="flex-1 p-3 overflow-y-auto space-y-3"
              >
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs p-3 rounded-lg ${
                        message.sender === 'doctor' 
                          ? 'bg-blue-600 text-white' 
                          : message.sender === 'system'
                            ? 'bg-gray-700 text-gray-300 text-xs'
                            : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter appointments by status
  const waitingAppointments = appointments.filter(app => app.status === 'waiting');
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/doctor/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Consultation Room
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-1" />
              Start Virtual Clinic
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{waitingAppointments.length}</p>
                  <p className="text-sm text-gray-600">Waiting Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{confirmedAppointments.length}</p>
                  <p className="text-sm text-gray-600">Scheduled Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Active Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Tabs */}
        <Tabs defaultValue="waiting" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="waiting" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Waiting Room ({waitingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled ({confirmedAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waiting" className="space-y-4">
            {waitingAppointments.length > 0 ? (
              waitingAppointments.map((appointment) => (
                <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{appointment.patient.name}</h3>
                            <span className="text-sm text-gray-500">({appointment.patient.age} years)</span>
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{appointment.patient.phone}</span>
                            </div>
                          </div>
                          {appointment.symptoms && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => startMeeting(appointment)}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Start Meeting
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No patients are currently waiting.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {confirmedAppointments.length > 0 ? (
              confirmedAppointments.map((appointment) => (
                <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{appointment.patient.name}</h3>
                            <span className="text-sm text-gray-500">({appointment.patient.age} years)</span>
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{appointment.patient.phone}</span>
                            </div>
                          </div>
                          {appointment.symptoms && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('View details for:', appointment._id)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => startMeeting(appointment)}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Start Meeting
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No scheduled appointments for today.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorConsultationPage;
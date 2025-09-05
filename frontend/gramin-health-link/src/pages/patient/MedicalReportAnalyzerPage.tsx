import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Image, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Brain,
  Activity,
  Heart,
  TrendingUp,
  Users
} from 'lucide-react';

// Correct Gradio client import and file handler
import { Client, handle_file } from '@gradio/client';

// Mock Header component
const Header = () => (
  <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b">
    <div className="container mx-auto px-4 py-3">
      <h1 className="text-xl font-semibold text-blue-600">HealthAI</h1>
    </div>
  </header>
);

// Mock toast functionality
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
};

// Enhanced interface for parsed analysis data
interface ParsedAnalysis {
  health_summary?: string;
  important_parameters?: Array<{
    category: string;
    test: string;
    value: string;
    range: string;
    status: string;
  }>;
  potential_risks?: string;
  recommendations?: string;
  lifestyle_suggestions?: string;
  doctor_consult?: string;
  motivational_closing?: string;
}

interface AnalysisResult {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  analysis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresDoctorVisit: boolean;
  parsedData?: ParsedAnalysis;
}

const MedicalReportAnalyzerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only PDF, JPG, or PNG files');
        return;
      }
      setSelectedFile(file);
      toast.success('File selected successfully');
    }
  };

  const analyzeReport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const client = await Client.connect("Sid26Roy/report-analyzer");
      const prediction = await client.predict("/analyze_report", {
        pdf_file: handle_file(selectedFile)
      });

      const analysisText = prediction?.data?.[0] || 'Analysis failed to retrieve a result.';
      
      let parsedData;
      try {
        parsedData = JSON.parse(analysisText);
      } catch (error) {
        parsedData = { health_summary: analysisText };
      }

      // Determine severity based on abnormal parameters
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (parsedData.important_parameters) {
        const abnormalCount = parsedData.important_parameters.filter((p: any) => 
          p.status === 'High' || p.status === 'Low'
        ).length;
        if (abnormalCount >= 5) severity = 'critical';
        else if (abnormalCount >= 3) severity = 'high';
        else if (abnormalCount >= 1) severity = 'medium';
      }

      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        fileType: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
        uploadDate: new Date().toISOString().split('T')[0],
        analysis: parsedData.health_summary || analysisText,
        severity,
        requiresDoctorVisit: !!(parsedData.doctor_consult || parsedData.potential_risks),
        parsedData
      };

      setAnalysisResults([newAnalysis, ...analysisResults]);
      setSelectedFile(null);
      toast.success('Report analyzed successfully');
    } catch (error) {
      console.error('Report analysis error:', error);
      toast.error('Failed to analyze the report. Please check the model and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Low Risk' },
      medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Medium Risk' },
      high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'High Risk' },
      critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Critical' }
    };
    
    const variant = variants[severity as keyof typeof variants] || variants.low;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${variant.bg} ${variant.text} ${variant.border}`}>
        {variant.label}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    if (status === 'High' || status === 'Low') {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const groupParametersByCategory = (parameters: any[]) => {
    return parameters.reduce((acc, param) => {
      if (!acc[param.category]) {
        acc[param.category] = [];
      }
      acc[param.category].push(param);
      return acc;
    }, {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical Report Analyzer</h1>
            <p className="text-lg text-gray-600">AI-powered analysis for better health insights</p>
          </div>

          {/* Upload Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Brain className="h-6 w-6" />
                Upload Medical Report
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="report-upload"
                />
                <label htmlFor="report-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div className="flex gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <Image className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <span className="text-xl font-semibold text-gray-700 mb-2">Click to upload medical report</span>
                  <span className="text-gray-500">Supports PDF, JPG, PNG files (Max 10MB)</span>
                </label>
                
                {selectedFile && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">{selectedFile.name}</p>
                        <p className="text-sm text-blue-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={analyzeReport} 
                disabled={!selectedFile || isAnalyzing}
                className="w-full mt-6 h-12 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing Report...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Analyze Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              Analysis Results
            </h2>
            
            {analysisResults.map((result) => (
              <Card key={result.id} className="shadow-lg">
                {/* Result Header */}
                <CardHeader className="bg-white border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        {result.fileType === 'pdf' ? (
                          <FileText className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Image className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{result.fileName}</h3>
                        <p className="text-gray-600">Analyzed on {new Date(result.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {getSeverityBadge(result.severity)}
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Doctor Alert */}
                  {result.requiresDoctorVisit && (
                    <div className="p-6 bg-red-50 border-b border-red-100">
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Medical Consultation Required:</strong> Your results show abnormalities that require professional medical attention.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <div className="p-6 space-y-8">
                    {/* Health Summary */}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Health Summary
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-800 leading-relaxed">{result.analysis}</p>
                      </div>
                    </div>

                    {/* Test Results by Category */}
                    {result.parsedData?.important_parameters && (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          Test Results
                        </h4>
                        <div className="grid gap-6">
                          {Object.entries(groupParametersByCategory(result.parsedData.important_parameters)).map(([category, params]) => (
                            <div key={category} className="bg-white border rounded-lg p-4">
                              <h5 className="font-semibold text-lg text-gray-900 mb-3 capitalize">{category} Parameters</h5>
                              <div className="space-y-2">
                                {(params as any[]).map((param, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      {getStatusIcon(param.status)}
                                      <div>
                                        <p className="font-medium text-gray-900">{param.test}</p>
                                        <p className="text-sm text-gray-600">Normal: {param.range}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-bold text-gray-900">{param.value}</p>
                                      <Badge className={
                                        param.status === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                                        param.status === 'Low' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                        'bg-green-100 text-green-800 border-green-200'
                                      }>
                                        {param.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {result.parsedData?.potential_risks && (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          Risk Assessment
                        </h4>
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                          <p className="text-orange-800 leading-relaxed">{result.parsedData.potential_risks}</p>
                        </div>
                      </div>
                    )}

                    {/* Recommendations Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {result.parsedData?.recommendations && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            Medical Recommendations
                          </h4>
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-800">{result.parsedData.recommendations}</p>
                          </div>
                        </div>
                      )}

                      {result.parsedData?.lifestyle_suggestions && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            Lifestyle Suggestions
                          </h4>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-green-800">{result.parsedData.lifestyle_suggestions}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Motivational Message */}
                    {result.parsedData?.motivational_closing && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">💪 Stay Positive</h4>
                        <p className="text-gray-800 italic">{result.parsedData.motivational_closing}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {analysisResults.length === 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Analyzed Yet</h3>
                  <p className="text-gray-600">Upload your first medical report to get started with AI-powered health insights.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportAnalyzerPage;
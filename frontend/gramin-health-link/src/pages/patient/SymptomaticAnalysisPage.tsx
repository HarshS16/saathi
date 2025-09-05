import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Brain, 
  Loader2, 
  Stethoscope, 
  Heart, 
  Shield, 
  CheckCircle,
  Clock,
  Activity,
  User,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Correct Gradio client import
import { Client } from '@gradio/client';

// Mock Header component
const Header = () => (
  <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b">
    <div className="container mx-auto px-4 py-3">
      <h1 className="text-xl font-semibold text-green-600">HealthAI</h1>
    </div>
  </header>
);

// Mock toast functionality
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
};

interface Condition {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matchPercentage: number;
  category?: string;
}

interface AnalysisResult {
  possibleConditions: Condition[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  riskFactors?: string[];
  nextSteps?: string[];
}

const SymptomaticAnalysisPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    id: string;
    symptoms: string;
    result: string;
    timestamp: string;
    severity: string;
  }>>([]);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please enter your symptoms');
      return;
    }

    setIsLoading(true);
    try {
      const client = await Client.connect('Sid26Roy/symptom_bio_bert');
      const prediction = await client.predict('/predict', [symptoms]);

      const resultLabel = prediction?.data?.[0]?.label || 'Unable to determine condition';
      const confidence = prediction?.data?.[0]?.confidence || 0.7;

      // Create enhanced analysis based on the prediction
      const enhancedAnalysis: AnalysisResult = {
        possibleConditions: [
          {
            name: resultLabel,
            description: `Based on the symptoms you've described, this condition shows the highest probability match.`,
            severity: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
            matchPercentage: Math.round(confidence * 100),
            category: 'Primary Diagnosis'
          }
        ],
        recommendations: [
          'Consult with a healthcare professional for proper diagnosis',
          'Monitor your symptoms and note any changes',
          'Maintain adequate rest and hydration',
          'Avoid self-medication without medical advice'
        ],
        urgencyLevel: confidence > 0.8 ? 'high' : 'medium',
        riskFactors: [
          'Symptoms may worsen if left untreated',
          'Early intervention often leads to better outcomes'
        ],
        nextSteps: [
          'Schedule an appointment with your primary care physician',
          'Keep a symptom diary with dates and severity',
          'Prepare a list of questions for your doctor visit'
        ]
      };

      setAnalysis(enhancedAnalysis);
      
      // Add to history
      const newHistoryEntry = {
        id: Date.now().toString(),
        symptoms: symptoms.substring(0, 100) + (symptoms.length > 100 ? '...' : ''),
        result: resultLabel,
        timestamp: new Date().toISOString(),
        severity: enhancedAnalysis.urgencyLevel
      };
      setAnalysisHistory([newHistoryEntry, ...analysisHistory]);

      toast.success('Analysis completed successfully');
    } catch (error: any) {
      console.error('Symptom analysis error:', error);
      toast.error(error.message || 'Failed to analyze symptoms');
    } finally {
      setIsLoading(false);
    }
  };

  const classifySymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please enter your symptoms');
      return;
    }

    setIsClassifying(true);
    try {
      const client = await Client.connect('Sid26Roy/symptom_bio_bert');
      const prediction = await client.predict('/predict', [symptoms]);

      const resultLabel = prediction?.data?.[0]?.label || 'Unknown condition';
      setClassification(resultLabel);
      toast.success('Classification successful');
    } catch (error: any) {
      console.error('Classification error:', error);
      toast.error(error.message || 'Failed to classify symptoms');
    } finally {
      setIsClassifying(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Low Risk' },
      medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Medium Risk' },
      high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'High Risk' },
      critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Critical' },
      emergency: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Emergency' }
    };
    
    const variant = variants[severity as keyof typeof variants] || variants.low;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${variant.bg} ${variant.text} ${variant.border}`}>
        {variant.label}
      </span>
    );
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Brain className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Symptomatic Analysis</h1>
            <p className="text-lg text-gray-600">AI-powered symptom analysis for better health understanding</p>
          </div>

          {/* Medical Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should never replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
            </AlertDescription>
          </Alert>

          {/* Symptom Input Section */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Stethoscope className="h-6 w-6" />
                Describe Your Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please provide detailed information about your symptoms
                  </label>
                  <Textarea
                    placeholder="Describe your symptoms in detail... Include when they started, severity, what makes them better or worse, and any other relevant information."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-32 resize-none text-base"
                    maxLength={1000}
                  />
                  <p className="text-sm text-gray-500 mt-2">{symptoms.length}/1000 characters</p>
                </div>
                
                <div className="flex gap-4 justify-end">
                  <Button
                    onClick={analyzeSymptoms}
                    disabled={isLoading || !symptoms.trim()}
                    className="min-w-40 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Full Analysis
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={classifySymptoms}
                    disabled={isClassifying || !symptoms.trim()}
                    variant="outline"
                    className="min-w-40 h-12"
                  >
                    {isClassifying ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5 mr-2" />
                        Quick Classification
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Classification Result */}
          {classification && (
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Shield className="h-5 w-5" />
                  Quick Classification Result
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{classification}</h3>
                    <p className="text-gray-600">This is a preliminary classification based on your symptoms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Urgency Alert */}
              {analysis.urgencyLevel === 'high' || analysis.urgencyLevel === 'emergency' ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>High Urgency:</strong> Your symptoms may require immediate medical attention. Please contact a healthcare provider as soon as possible.
                  </AlertDescription>
                </Alert>
              ) : null}

              {/* Possible Conditions */}
              <Card className="shadow-lg">
                <CardHeader className="bg-white border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Activity className="h-6 w-6 text-blue-600" />
                    Possible Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {analysis.possibleConditions.map((condition, index) => (
                      <div key={index} className="bg-gray-50 border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{condition.name}</h3>
                            {condition.category && (
                              <p className="text-sm text-blue-600 font-medium">{condition.category}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getSeverityBadge(condition.severity)}
                            <span className="text-sm text-gray-600">{condition.matchPercentage}% match</span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors & Next Steps Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.riskFactors && (
                  <Card className="shadow-lg">
                    <CardHeader className="bg-orange-50 border-b border-orange-100">
                      <CardTitle className="flex items-center gap-2 text-orange-800">
                        <TrendingUp className="h-5 w-5" />
                        Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-2">
                        {analysis.riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.nextSteps && (
                  <Card className="shadow-lg">
                    <CardHeader className="bg-blue-50 border-b border-blue-100">
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <User className="h-5 w-5" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-2">
                        {analysis.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Recommendations */}
              <Card className="shadow-lg">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Shield className="h-5 w-5" />
                    Medical Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analysis History */}
          {analysisHistory.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Recent Analysis History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.result}</p>
                        <p className="text-sm text-gray-600">{entry.symptoms}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getSeverityBadge(entry.severity)}
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!analysis && !classification && (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Analyze Your Symptoms</h3>
                <p className="text-gray-600">Describe your symptoms above to get AI-powered health insights and recommendations.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomaticAnalysisPage;
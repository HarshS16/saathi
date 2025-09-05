import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || !symptoms.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Symptoms description is required'
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
You are a medical AI assistant. Analyze the following symptoms and provide a structured medical assessment. 

IMPORTANT DISCLAIMERS:
- This is for informational purposes only
- Not a substitute for professional medical advice
- Always recommend consulting healthcare providers

Patient Symptoms: "${symptoms}"

Please provide a JSON response with the following structure:
{
  "possibleConditions": [
    {
      "name": "Condition name",
      "description": "Brief description of the condition",
      "severity": "low|medium|high",
      "matchPercentage": "percentage of symptom match"
    }
  ],
  "recommendations": {
    "immediate": ["immediate actions to take"],
    "general": ["general care recommendations"],
    "followUp": ["when and why to follow up with healthcare providers"]
  },
  "urgencyLevel": "low|medium|high",
  "urgencyMessage": "Clear message about urgency level",
  "redFlags": ["warning signs that require immediate medical attention"],
  "disclaimer": "Medical disclaimer message"
}

Focus on:
1. Most likely conditions based on symptoms
2. Practical, safe recommendations
3. Clear urgency assessment
4. When to seek professional help
5. Red flag symptoms to watch for

Keep responses professional, empathetic, and medically sound.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from the response
        let analysis;
        try {
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            // Fallback: create structured response from text
            analysis = {
                possibleConditions: [
                    {
                        name: "Analysis Available",
                        description: text.substring(0, 200) + "...",
                        severity: "medium",
                        matchPercentage: "N/A"
                    }
                ],
                recommendations: {
                    immediate: ["Consult with a healthcare provider for proper diagnosis"],
                    general: ["Monitor symptoms and keep a symptom diary"],
                    followUp: ["Schedule an appointment with your doctor within 1-2 days"]
                },
                urgencyLevel: "medium",
                urgencyMessage: "Please consult with a healthcare provider for proper evaluation.",
                redFlags: ["Severe or worsening symptoms", "Difficulty breathing", "Chest pain", "High fever"],
                disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice."
            };
        }

        // Ensure disclaimer is always present
        if (!analysis.disclaimer) {
            analysis.disclaimer = "This analysis is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.";
        }

        res.status(200).json({
            success: true,
            analysis,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Symptom analysis error:', error);
        
        // Provide a safe fallback response
        const fallbackAnalysis = {
            possibleConditions: [
                {
                    name: "Unable to Complete Analysis",
                    description: "We're currently unable to process your symptoms. Please consult with a healthcare provider.",
                    severity: "medium",
                    matchPercentage: "N/A"
                }
            ],
            recommendations: {
                immediate: ["Consult with a healthcare provider"],
                general: ["Monitor your symptoms", "Rest and stay hydrated"],
                followUp: ["Schedule a medical appointment if symptoms persist or worsen"]
            },
            urgencyLevel: "medium",
            urgencyMessage: "Please consult with a healthcare provider for proper evaluation of your symptoms.",
            redFlags: ["Severe or worsening symptoms", "Difficulty breathing", "Chest pain", "High fever", "Loss of consciousness"],
            disclaimer: "This analysis is for informational purposes only and should not replace professional medical advice."
        };

        res.status(200).json({
            success: true,
            analysis: fallbackAnalysis,
            message: "Analysis completed with limited information. Please consult a healthcare provider.",
            timestamp: new Date().toISOString()
        });
    }
};
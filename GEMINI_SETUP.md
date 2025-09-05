# Gemini API Setup Guide

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure Backend

1. Install the dependency:
   ```bash
   cd Backend
   npm install @google/generative-ai
   ```

2. Add your API key to `.env`:
   ```env
   GEMINI_API_KEY=your-actual-gemini-api-key
   ```

## Step 3: Test the Feature

1. Start the backend server
2. Navigate to `/patient/symptomatic-analysis`
3. Enter symptoms and click "Analyze Symptoms"

## Features

- AI-powered symptom analysis using Gemini Pro
- Structured medical insights
- Urgency level assessment
- Safety recommendations
- Medical disclaimers
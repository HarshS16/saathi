import express from 'express';
import { analyzeSymptoms } from '../controllers/healthAnalysisController.js';

const router = express.Router();

// Symptom analysis endpoint
router.post('/analyze-symptoms', analyzeSymptoms);

export default router;
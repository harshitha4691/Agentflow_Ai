import express from 'express';
import { saveWorkflow, getUserWorkflows } from '../controllers/workflowController.js';

const router = express.Router();

// Publicly permissive fallback mapping for development
router.post('/save', saveWorkflow);
router.get('/all', getUserWorkflows);

export default router;
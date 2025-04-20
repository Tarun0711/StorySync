import express from 'express';
import { analyzeContribution, addContribution } from '../controllers/contributionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Route for analyzing contributions
router.post('/analyze', authenticate, analyzeContribution);

// Route for adding contributions to a story
router.post('/stories/:id/contributions', authenticate, addContribution);

export default router; 
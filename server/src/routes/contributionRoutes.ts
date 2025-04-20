import express from 'express';
import { analyzeContribution, addContribution, getContributions, deleteContribution } from '../controllers/contributionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Route for getting all contributions
router.get('/', authenticate, getContributions);

// Route for analyzing contributions
router.post('/analyze', authenticate, analyzeContribution);

// Route for adding contributions to a story
router.post('/stories/:id/contributions', authenticate, addContribution);

// Route for deleting a contribution
router.delete('/:id', authenticate, deleteContribution);

export default router; 
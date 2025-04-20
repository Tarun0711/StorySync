import express from 'express';
import { 
  createStory, 
  getStory, 
  updateStory, 
  deleteStory, 
  listStories 
} from '../controllers/storyController';
import { authenticate } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';

const router = express.Router();

// Apply optional authentication middleware to all routes
router.use(optionalAuth);

// Story routes
router.post('/', authenticate, createStory);
router.get('/', optionalAuth, listStories);
router.get('/:id', getStory);
router.put('/:id', authenticate, updateStory);
router.delete('/:id', authenticate, deleteStory);

export default router; 
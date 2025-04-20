import express from 'express';
import { getNotifications, markAsRead, getNotificationById } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/:userId', authenticate, getNotifications);
router.get('/notification/:id', authenticate, getNotificationById);
router.put('/:id/read', authenticate, markAsRead);

export default router; 
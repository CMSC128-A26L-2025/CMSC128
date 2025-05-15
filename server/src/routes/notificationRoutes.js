// server/src/routes/notificationRoutes.js

import express from 'express';
import {
  notificationController,
  getMyUnread,
  markAsRead
} from '../controllers/modelControllers/notificationController.js';
import { validateToken } from '../middleware/validate-token.js';

const router = express.Router();

router.get('/unread', validateToken, getMyUnread);

router.patch('/:id/read', validateToken, markAsRead);

router.delete('/:id', validateToken, notificationController.remove);

export default router;

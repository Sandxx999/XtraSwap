import express from 'express';
import {
  sendMessage,
  getMessages,
  getConversations
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/conversations').get(protect, getConversations);
router.route('/:listingId/:otherUserId').get(protect, getMessages);

export default router;
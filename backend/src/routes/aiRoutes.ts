import express from 'express';
import { analyzeImage } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/analyze').post(protect, analyzeImage);

export default router;
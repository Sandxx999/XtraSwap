import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  deleteListing,
} from '../controllers/listingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/:id').get(getListingById).delete(protect, deleteListing);

export default router;

import { Request, Response } from 'express';
import Listing from '../models/Listing.js';

// @desc    Fetch all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius, category, search } = req.query;
    let query: any = { status: 'Available' };

    // Search filter
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Geolocation filter
    if (lat && lng) {
      const maxDistance = radius ? Number(radius) * 1000 : 10 * 1000; // default 10km
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: maxDistance,
        },
      };
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name email rating')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'seller',
      'name email rating'
    );

    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req: any, res: Response) => {
  try {
    let {
      title,
      description,
      category,
      price,
      mrp,
      condition,
      images,
      address,
      expiryDate,
      coordinates,
    } = req.body;

    console.log('Creating listing for user:', req.user._id);

    const listing = new Listing({
      seller: req.user._id,
      title,
      description,
      category,
      price: price ? Number(price) : 0,
      mrp: mrp ? Number(mrp) : undefined,
      condition,
      images,
      address,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      location: coordinates ? { type: 'Point', coordinates } : undefined,
    });

    const createdListing = await listing.save();
    console.log('Listing created successfully:', createdListing._id);
    res.status(201).json(createdListing);
  } catch (error: any) {
    console.error('Create Listing Error:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to create listing. Please check your inputs.',
      error: error.stack
    });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req: any, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      if (listing.seller.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401).json({ message: 'User not authorized' });
        return;
      }

      await listing.deleteOne();
      res.json({ message: 'Listing removed' });
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { getListings, getListingById, createListing, deleteListing };

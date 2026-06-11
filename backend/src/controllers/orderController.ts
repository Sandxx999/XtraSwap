import { Request, Response } from 'express';
import Order from '../models/Order.js';
import Listing from '../models/Listing.js';

// @desc    Create new order (Mock Payment)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req: any, res: Response) => {
  try {
    const { listingId, paymentMethod } = req.body;
    const buyerId = req.user._id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.isSold || listing.status === 'Sold') {
      res.status(400).json({ message: 'Item is already sold' });
      return;
    }

    const order = await Order.create({
      buyer: buyerId,
      seller: listing.seller,
      listing: listingId,
      paymentMethod,
      amount: listing.price,
      status: 'Completed', // Mocking instant success
    });

    // Mark listing as sold
    listing.isSold = true;
    listing.status = 'Sold';
    await listing.save();

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder };
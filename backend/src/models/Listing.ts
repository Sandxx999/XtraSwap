import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Food & Groceries', 'Electronics', 'Household', 'Clothing', 'Books', 'Personal Care', 'Gaming', 'Kids'],
    },
    price: { type: Number, required: true, default: 0 },
    mrp: { type: Number },
    condition: {
      type: String,
      required: true,
      enum: ['Unopened', 'Like New', 'Good', 'Used'],
    },
    images: [{ type: String }],
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    address: { type: String },
    expiryDate: { type: Date },
    isSold: { type: Boolean, default: false },
    status: {
      type: String,
      default: 'Available',
      enum: ['Available', 'Pending', 'Sold', 'Hidden'],
    },
  },
  { timestamps: true }
);

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
export default Listing;

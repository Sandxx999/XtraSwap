import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Listing',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['UPI', 'Card', 'COD'],
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Completed',
      enum: ['Pending', 'Completed', 'Cancelled'],
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
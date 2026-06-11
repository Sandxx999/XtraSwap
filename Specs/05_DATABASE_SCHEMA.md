--- FILE: 05_DATABASE_SCHEMA.md ---

# Database Schema

**Owner:** Backend Developer
**Database:** MongoDB
**ORM:** Mongoose

## 1. Users Collection
```javascript
const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  name: { type: String, trim: true },
  avatarUrl: { type: String },
  roles: { 
    type: [String], 
    enum: ['BUYER', 'SELLER', 'DELIVERY_AGENT', 'ADMIN', 'NGO'], 
    default: ['BUYER', 'SELLER'] 
  },
  verificationStatus: { 
    type: String, 
    enum: ['UNVERIFIED', 'VERIFIED'], 
    default: 'UNVERIFIED' 
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  greenScore: { type: Number, default: 0 },
  strikeCount: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }, // [longitude, latitude]
    addressText: { type: String }
  },
  preferences: {
    notificationsEnabled: { type: Boolean, default: true },
    fcmToken: { type: String }
  }
}, { timestamps: true });
```
**Indexes:** `phone` (unique), `location.coordinates` (2dsphere).
**Virtuals:** `isSuspended` (status === 'SUSPENDED').

## 2. Listings Collection
```javascript
const listingSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, index: 'text' },
  description: { type: String, trim: true, index: 'text' },
  category: { 
    type: String, 
    enum: ['GROCERIES', 'ELECTRONICS', 'HOUSEHOLD', 'FASHION', 'OTHER'], 
    required: true, 
    index: true 
  },
  condition: { 
    type: String, 
    enum: ['NEW', 'LIKE_NEW', 'USED', 'FAIR'], 
    required: true 
  },
  images: [{ type: String }], // Cloudinary URLs
  price: { type: Number, required: true }, // Selling price
  mrp: { type: Number, required: true }, // Original price
  expiryDate: { type: Date }, // Required if category is GROCERIES
  fulfillmentOptions: {
    type: [String],
    enum: ['PICKUP', 'DELIVERY'],
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // Copied from seller at creation
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'PENDING', 'SOLD', 'EXPIRED', 'DELETED', 'REMOVED'], 
    default: 'ACTIVE',
    index: true
  },
  viewCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to ensure price <= 80% of MRP
listingSchema.pre('save', function(next) {
  if (this.price > this.mrp * 0.8) {
    next(new Error('Selling price must be at least 20% below MRP.'));
  } else {
    next();
  }
});
```
**Indexes:** `sellerId`, `category`, `status`, `location.coordinates` (2dsphere), text index on `title` and `description`.
**Pre-save Hook:** Validates the 80% price cap rule.

## 3. Orders Collection
```javascript
const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  fulfillmentType: { type: String, enum: ['PICKUP', 'DELIVERY'], required: true },
  pickupOTP: { type: String }, // 4-digit code
  deliveryOTP: { type: String }, // 4-digit code
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'CASH_ON_PICKUP', 'FAILED', 'REFUNDED'], 
    default: 'PENDING' 
  },
  paymentGatewayOrderId: { type: String }, // Razorpay Order ID
  escrowStatus: {
    type: String,
    enum: ['NOT_APPLICABLE', 'HELD', 'RELEASED', 'REFUNDED'],
    default: 'NOT_APPLICABLE'
  },
  escrowReleasedAt: { type: Date },
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['PENDING_PICKUP', 'LOOKING_FOR_AGENT', 'AGENT_ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
    default: 'PENDING_PICKUP',
    index: true
  },
  statusTimeline: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, { timestamps: true });
```
**Indexes:** `buyerId`, `sellerId`, `status`.

## 4. Messages Collection
```javascript
const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, index: true }, // Format: "orderId" or "buyerId_sellerId_listingId"
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  content: { type: String, required: true },
  messageType: { type: String, enum: ['TEXT', 'IMAGE', 'SYSTEM'], default: 'TEXT' },
  readAt: { type: Date }
}, { timestamps: true });
```
**Indexes:** `conversationId`, `senderId`, `receiverId`.

## 5. Reviews Collection
```javascript
const reviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  type: { type: String, enum: ['BUYER_TO_SELLER', 'SELLER_TO_BUYER'], required: true }
}, { timestamps: true });

// Post-save hook to update User average rating
reviewSchema.post('save', async function(doc) {
  // Aggregate reviews for revieweeId and update users collection ratings.average
});
```
**Indexes:** `revieweeId`, `orderId` (unique).
**Post-save Hook:** Aggregates and updates the `ratings` field on the `User` schema.

## 6. Delivery Jobs Collection
```javascript
const deliveryJobSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  pickupOTP: { type: String }, // Provided by seller to agent
  deliveryOTP: { type: String }, // Provided by buyer to agent
  status: {
    type: String,
    enum: ['BROADCASTING', 'ACCEPTED', 'AT_PICKUP', 'PICKED_UP', 'AT_DROPOFF', 'DELIVERED', 'CANCELLED'],
    default: 'BROADCASTING'
  },
  locationTrace: [{
    coordinates: { type: [Number] },
    timestamp: { type: Date, default: Date.now }
  }],
  earnings: { type: Number, required: true }
}, { timestamps: true });
```
**Indexes:** `agentId`, `status`.

## 7. Notifications Collection
```javascript
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['ORDER_UPDATE', 'NEW_MESSAGE', 'JOB_ALERT', 'SYSTEM', 'WARNING'] 
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // Arbitrary payload (e.g., orderId)
  isRead: { type: Boolean, default: false },
  channel: { type: String, enum: ['PUSH', 'SMS', 'IN_APP'], default: 'IN_APP' }
}, { timestamps: true });
```
**Indexes:** `userId`, `isRead`.

## 8. Reports Collection
```javascript
const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['LISTING', 'USER'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  reason: { 
    type: String, 
    enum: ['FAKE', 'PROHIBITED', 'EXPIRED', 'NO_SHOW', 'INAPPROPRIATE', 'OTHER'],
    required: true
  },
  description: { type: String },
  status: { type: String, enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'], default: 'PENDING' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
  resolutionNote: { type: String }
}, { timestamps: true });
```
**Indexes:** `targetId`, `status`.

## 9. Locality Groups Collection (P2)
```javascript
const localityGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  polygon: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]] } // Array of arrays of coordinates
  },
  memberCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });
```
**Indexes:** `polygon.coordinates` (2dsphere).

## Relationships Diagram
```text
User 1 -- * Listing (as Seller)
User 1 -- * Order (as Buyer)
User 1 -- * Order (as Seller)
User 1 -- * Order (as DeliveryAgent)
Order 1 -- 1 Listing
Order 1 -- 1 DeliveryJob
Order 1 -- 1 Review (Buyer to Seller)
Order 1 -- 1 Review (Seller to Buyer)
User 1 -- * Message (as Sender)
User 1 -- * Message (as Receiver)
Listing 1 -- * Report
User 1 -- * Notification
```

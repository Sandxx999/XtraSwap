--- FILE: 03_USER_FLOWS.md ---

# User Flows

## 1. New User Registration
1. **User:** Enters phone number on `/login` screen.
2. **System:** Calls `POST /api/auth/send-otp`. Returns success.
3. **User:** Enters 6-digit OTP.
4. **System:** Calls `POST /api/auth/verify-otp`. Generates JWT.
   - *[IF existing user]* Transitions to `/browse`.
   - *[ELSE new user]* Transitions to profile setup.
5. **User:** Enters Name and optional Avatar.
6. **System:** Calls `PUT /api/users/profile`.
7. **System:** Prompts for Location Permission.
   - *[IF granted]* Captures lat/lng. Calls `PUT /api/users/location`.
   - *[IF denied]* Prompts manual city/area selection.
8. **System:** Transitions to `/browse`.

## 2. Seller: List an Item
1. **Seller:** Clicks "+" FAB, transitions to `/sell`.
2. **Seller (Step 1):** Uploads/captures 1-4 photos. System uploads to Cloudinary.
3. **Seller (Step 2):** Enters Title, Category, and Condition.
4. **Seller (Step 3):** Enters original MRP and Selling Price.
   - *[Error Path]* If Selling Price > 80% of MRP, system shows error "Price must be at least 20% off".
5. **Seller (Step 4):** Selects fulfillment options (Self-Pickup, Delivery, or Both) and Expiry Date (if applicable).
6. **Seller:** Clicks "Publish".
7. **System:** Calls `POST /api/listings`.
8. **System:** Transitions to `/listing/:id` with a success toast.

## 3. Buyer: Self-Pickup Purchase
1. **Buyer:** Browses `/browse`, filters by "< 2km distance".
2. **Buyer:** Taps a listing, views details on `/listing/:id`.
3. **Buyer:** Taps "Buy Now", transitions to `/checkout/:orderId`.
4. **Buyer:** Selects "Self-Pickup" (Free).
5. **System:** Calls `POST /api/orders` creating order with status `PENDING_PICKUP`.
6. **System:** Generates a 4-digit Pickup OTP. Displays on buyer's screen.
7. **Buyer & Seller:** Coordinate time via in-app chat (`/inbox`).
8. **Buyer:** Arrives at seller's location, hands over cash, provides OTP.
9. **Seller:** Enters OTP on their order screen.
10. **System:** Calls `POST /api/orders/:id/confirm-pickup`. Updates status to `COMPLETED`.
11. **System:** Prompts both users to leave a rating.

## 4. Buyer: Delivery Purchase
1. **Buyer:** On `/checkout/:orderId`, selects "Delivery".
2. **System:** Calculates distance-based fee. Displays total amount.
3. **Buyer:** Pays via Razorpay online.
4. **System:** Calls `POST /api/payments/initiate`. Webhook confirms payment.
5. **System:** Updates order status to `LOOKING_FOR_AGENT`.
6. **System:** Broadcasts job to nearby agents.
7. **Buyer:** Transitions to `/order/:orderId/track` (Live Map).
8. **Agent:** Accepts job. System updates status to `AGENT_ASSIGNED`.
9. **Agent:** Picks up item from seller (requires Pickup OTP from seller).
10. **Agent:** Delivers to buyer (requires Delivery OTP from buyer).
11. **System:** Order status `COMPLETED`. Escrow released to seller.

## 5. Buyer Raises Dispute
1. **Buyer:** Order is in `COMPLETED` state. Buyer finds item is defective/expired.
2. **Buyer:** Goes to order details, taps "Report Issue".
3. **Buyer:** Selects reason, adds description and photo evidence.
4. **System:** Calls `POST /api/orders/:id/dispute`. Updates status to `DISPUTED`.
5. **System:** Freezes seller's escrow payout (if applicable).
6. **Admin:** Reviews dispute in `/admin`.
   - *[IF resolved for buyer]* Refunds buyer, issues strike to seller.
   - *[IF resolved for seller]* Releases escrow to seller.

## 6. Seller Edits or Deletes a Listing
1. **Seller:** Goes to `/dashboard`.
2. **Seller:** Taps "Edit" on an active listing.
3. **System:** Loads data into `/sell` form.
4. **Seller:** Changes price and saves.
5. **System:** Calls `PUT /api/listings/:id`.
6. **Seller:** Alternatively, taps "Delete".
   - *[IF order pending]* System rejects deletion, shows error.
   - *[ELSE]* Calls `DELETE /api/listings/:id`. Status updated to `DELETED`.

## 7. Delivery Agent Flow
1. **Agent:** Toggles status to "Online" on their dashboard.
2. **System:** Calls `PUT /api/delivery/status`. Listens on Socket.io for jobs.
3. **System:** Pushes new job notification with pickup/drop approx distance and earnings.
4. **Agent:** Taps "Accept". Calls `POST /api/delivery/jobs/:id/accept`.
5. **System:** Reveals exact pickup address to agent.
6. **Agent:** Reaches seller, asks for Pickup OTP. Calls `POST /api/delivery/jobs/:id/pickup`.
7. **System:** Reveals exact drop address to agent.
8. **Agent:** Reaches buyer, asks for Delivery OTP. Calls `POST /api/delivery/jobs/:id/deliver`.
9. **System:** Credits agent wallet.

## 8. Admin Reviews Flagged Listing
1. **User:** Flags a listing as "Prohibited Item". Calls `POST /api/reports`.
2. **Admin:** Opens `/admin` dashboard. Sees new report.
3. **Admin:** Reviews listing details and reporter comments.
4. **Admin:** Decides action.
   - *[IF violation]* Clicks "Remove Listing". Calls `POST /api/admin/reports/:id/resolve` with action `DELETE_LISTING`. Issue strike to seller.
   - *[IF false alarm]* Clicks "Dismiss". Report marked resolved.

## 9. Seller Strike System
1. **System:** Seller commits a violation (e.g., No-show on pickup, listed fake item).
2. **Admin:** Issues strike. Calls `POST /api/admin/users/:id/strike`.
3. **System:** Increments user `strikeCount`.
4. **System:** Checks threshold:
   - *[IF strikeCount == 1 or 2]* Sends warning notification.
   - *[IF strikeCount >= 3]* Automatically suspends account (`status = SUSPENDED`). Logs user out, revokes tokens.

## 10. Escrow Release
1. **Buyer:** Completes online payment for delivery order.
2. **System:** Funds held in Razorpay Route/Escrow virtual account.
3. **Agent:** Delivers item successfully (Delivery OTP verified).
4. **System:** Starts 2-hour dispute window timer.
5. **System:** Timer expires with no dispute raised.
6. **System:** Cron job triggers `POST /api/payments/release-escrow`.
7. **System:** Razorpay transfers funds (minus 5% platform fee) to Seller's connected bank account.
8. **System:** Updates order `escrowStatus` to `RELEASED`. Sends notification to seller.

--- FILE: 08_PAGE_SPECS.md ---

# Page Specifications

**Owner:** Frontend Developer

### 1. Home / Landing Page
**Route:** `/`
**Auth required:** No
**Purpose:** Introduce XtraSwap, explain the value prop, and prompt login/download.
**Layout:** Single column scrolling page.
**Sections:**
- Hero Section (Headline, illustration, "Start Swapping" CTA).
- How it Works (3-step visual: Snap, Connect, Swap).
- Live Preview (Horizontal scroll of nearby generic items).
- Trust & Safety (Badges for OTP, Verified users).
**Components used:** `Navbar`, `Button`, `ListingCard` (skeleton during load).
**API calls:** `GET /api/listings?radius=10` (no auth needed for generic feed).
**States:** Public view only. Logged-in users are redirected to `/browse`.

### 2. Browse (Main Feed)
**Route:** `/browse`
**Auth required:** Yes
**Purpose:** Discovery of nearby surplus items.
**Layout:** Map view toggle + Grid view.
**Sections:**
- Top bar: Location selector and Search Input.
- Category Chips (horizontal scrollable).
- Main Grid: 2 columns on mobile, 4 on desktop.
**Components used:** `Navbar`, `BottomNav`, `ListingCard`, `CategoryChip`, `FilterDrawer`.
**API calls:** `GET /api/listings` on mount. Re-fetched on location or filter change.
**States:** 
- *Loading:* Grid of `SkeletonCard`.
- *Empty:* "No items found in your area. Be the first to list!" illustration.
**Mobile differences:** Map view is a floating FAB that swaps the grid to a full-screen map.

### 3. Listing Detail
**Route:** `/listing/:id`
**Auth required:** Yes
**Purpose:** View product details and initiate purchase/chat.
**Layout:** Split layout (Desktop) / Vertical scroll (Mobile).
**Sections:**
- Image Carousel.
- Header (Title, Price, MRP strikethrough, Discount Badge).
- Seller Info (Avatar, Name, Rating, Green Score).
- Description & Condition.
- Map Preview (Approximate circle, not exact pin).
- Action Bar (sticky bottom): "Message Seller" and "Buy Now".
**Components used:** `Badge`, `Button`, `RatingStars`.
**API calls:** `GET /api/listings/:id`.
**States:** 
- *Sold:* "This item has been sold" overlay, disabled buttons.

### 4. Create Listing (Sell)
**Route:** `/sell`
**Auth required:** Yes
**Purpose:** Form to post a new item.
**Layout:** Multi-step wizard or long scrolling form.
**Sections:**
- Step 1: `ImageUploadZone`.
- Step 2: Title, Category (dropdown), Condition (radio).
- Step 3: `PriceRangeSlider` or explicit inputs for MRP & Price. (Validation text visible).
- Step 4: Fulfillment checkboxes and Expiry Date.
**Components used:** `Input`, `StepProgressBar`, `Button (Loading)`.
**API calls:** `POST /api/listings` on submit.
**States:** Submit button disabled until validation passes.

### 5. Checkout
**Route:** `/checkout/:orderId`
**Auth required:** Yes
**Purpose:** Select fulfillment method and pay.
**Layout:** Centered card.
**Sections:**
- Order Summary (Item, Price).
- Fulfillment Toggle (Pickup vs Delivery).
- *If Delivery:* Address input and Delivery Fee calculation.
- Total breakdown.
- Pay/Confirm Button.
**Components used:** `FulfillmentToggle`, `Button`.
**API calls:** `POST /api/payments/initiate` (if delivery).

### 6. Order Confirmation / Status
**Route:** `/order/:orderId/confirm`
**Auth required:** Yes
**Purpose:** Show OTP for pickup or track delivery.
**Layout:** Focus on the OTP or map.
**Sections:**
- Big bold text: "Your Pickup OTP: 4812" (If Pickup).
- Chat button to message seller.
- Address revealed.
**Components used:** `Button`, `ToastNotification` (when status changes).
**API calls:** `GET /api/orders/:id`. Socket listener for status change.
**States:** Once `COMPLETED`, swaps to Rating prompt.

### 7. Inbox (Chat)
**Route:** `/inbox`
**Auth required:** Yes
**Purpose:** List active conversations.
**Layout:** List view.
**Sections:**
- Chat list (Avatar, Item Name, Last Message preview, unread dot).
**Components used:** `BottomNav`.
**API calls:** `GET /api/chat/conversations`.

### 8. Conversation View
**Route:** `/inbox/:convId`
**Auth required:** Yes
**Purpose:** Real-time messaging.
**Layout:** Standard chat UI.
**Sections:**
- Header (Item context, back button).
- Message thread (scroll to bottom).
- Input area (Text field, Send button).
**Components used:** `ChatBubble`, `Input`.
**API calls:** Socket `join_room`, REST fallback `GET /api/chat/messages/:convId`.

### 9. Public Profile
**Route:** `/profile/:userId`
**Auth required:** Yes
**Purpose:** Build trust by showing user history.
**Layout:** Header + Tabbed list.
**Sections:**
- User info (Avatar, Joined Date, Rating, Badges).
- Tab 1: Active Listings.
- Tab 2: Reviews Received.
**Components used:** `ListingCard`, `RatingStars`.
**API calls:** `GET /api/users/:id/public`.

### 10. Seller Dashboard
**Route:** `/dashboard`
**Auth required:** Yes
**Purpose:** Manage active items and view earnings.
**Layout:** Dashboard grid.
**Sections:**
- Top Stats (Total Earned, Active Items).
- List of items with "Edit" / "Mark Sold" / "Delete" buttons.
**Components used:** `Button`.
**API calls:** `GET /api/listings/seller/:userId`.

### 11. Login / Register
**Route:** `/login`
**Auth required:** No
**Purpose:** Authentication.
**Layout:** Centered card (Desktop) / Full screen (Mobile).
**Sections:**
- Phone number input.
- OTP entry (conditional).
**Components used:** `OTPInput`, `Button`.
**API calls:** `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`.

--- FILE: 04_FEATURES.md ---

# Features

### Authentication & Profiles
**Description:** User registration, login via phone number with OTP verification, and basic profile setup.
**User Role:** All users
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] User can enter a 10-digit phone number.
- [ ] System sends a 6-digit OTP via SMS (Twilio/Firebase).
- [ ] User can enter OTP within 5 minutes.
- [ ] Successful OTP generates a JWT token.
- [ ] First-time users are prompted to add a name and location.
**Edge Cases:**
- Invalid phone number format.
- OTP expires.
- Rate limiting (max 3 OTP requests per hour).
**Dependencies:** None

### Listing Creation
**Description:** Sellers can post an item for sale with photos, details, and price.
**User Role:** Seller
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] Upload up to 4 images (compress before upload).
- [ ] Select category from a predefined list.
- [ ] Input Title, Description, and Condition.
- [ ] Specify original MRP and selling price.
- [ ] Choose fulfillment options (Pickup, Delivery, or Both).
**Edge Cases:**
- Image upload failure.
- Price validation fails (selling price > 80% MRP).
**Dependencies:** Authentication

### Expiry Validation
**Description:** Perishable items automatically unlist when they pass their expiry date.
**User Role:** System
**Priority:** P0
**Owner:** Backend
**Acceptance Criteria:**
- [ ] Listing creation requires an expiry date if category is 'Food/Groceries'.
- [ ] Cron job/TTL index automatically changes listing status to `EXPIRED` at 00:00 on the expiry date.
- [ ] Expired items are removed from search and discovery.
**Edge Cases:**
- Expiry date selected is in the past during creation.
**Dependencies:** Listing Creation

### Location Discovery & Category Filter
**Description:** Buyers browse a map or feed of items available nearby, filtered by category.
**User Role:** Buyer
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] Fetch listings within a 5km radius based on user's current geo-coordinates.
- [ ] Sort by distance or price.
- [ ] Filter toggles for categories (Groceries, Electronics, etc.).
**Edge Cases:**
- User denies location permission (fallback to manual text entry).
- No listings found in the radius.
**Dependencies:** Listing Creation

### Self-Pickup & OTP
**Description:** Buyer opts to pick up the item. A secure 4-digit OTP validates the handover.
**User Role:** Buyer, Seller
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] Buyer selects "Self-Pickup" at checkout.
- [ ] System generates a 4-digit code shown to the Buyer.
- [ ] Seller enters the OTP on their dashboard to complete the order.
**Edge Cases:**
- Buyer doesn't show up.
- Seller rejects OTP.
**Dependencies:** Authentication, Listing Creation

### Basic Chat
**Description:** Real-time messaging between buyer and seller to coordinate pickups.
**User Role:** Buyer, Seller
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] A chat thread is created when a buyer clicks "Message Seller".
- [ ] Real-time updates via WebSockets.
- [ ] System messages automatically injected for order status updates.
**Edge Cases:**
- User goes offline (fallback to push notifications).
- Inappropriate language.
**Dependencies:** Authentication

### Cash Payment
**Description:** Support for cash exchange outside the platform for self-pickup orders.
**User Role:** Buyer, Seller
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] Order summary clearly states "Amount to pay: ₹X in Cash".
- [ ] OTP handover acts as confirmation that cash was exchanged.
**Edge Cases:**
- Buyer doesn't have exact change (out of system scope, but mention in UI warnings).
**Dependencies:** Self-Pickup

### Ratings & Reviews
**Description:** Users rate each other 1-5 stars after a completed transaction.
**User Role:** Buyer, Seller
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] Prompt appears after order status changes to `COMPLETED`.
- [ ] Aggregated average rating is displayed on user profiles.
**Edge Cases:**
- User dismisses the prompt.
**Dependencies:** Self-Pickup, Delivery Flow

### Price Cap Enforcement
**Description:** Business rule preventing sellers from scalping by requiring steep discounts.
**User Role:** Seller
**Priority:** P0
**Owner:** Backend
**Acceptance Criteria:**
- [ ] Selling price must be ≤ 80% of stated MRP.
- [ ] API rejects payload if the calculation fails.
**Edge Cases:**
- Zero MRP items.
**Dependencies:** Listing Creation

### Report System
**Description:** Users can flag suspicious or prohibited listings.
**User Role:** All users
**Priority:** P0
**Owner:** Both
**Acceptance Criteria:**
- [ ] "Report" button on listing page.
- [ ] Requires selecting a reason (Fake, Expired, Prohibited).
- [ ] Triggers alert in Admin dashboard.
**Edge Cases:**
- Malicious mass-reporting by bots.
**Dependencies:** Authentication

### Delivery Flow
**Description:** Buyers can choose delivery for an extra fee. Local agents fulfill the order.
**User Role:** Buyer, Seller, Delivery Agent
**Priority:** P1
**Owner:** Both
**Acceptance Criteria:**
- [ ] Distance between Buyer and Seller calculated via Google Maps Matrix API.
- [ ] Delivery fee dynamically calculated (Base fee + ₹X per km).
- [ ] Agent app receives broadcast; first to accept gets the job.
- [ ] Dual OTP (Pickup OTP from Seller, Delivery OTP from Buyer).
**Edge Cases:**
- No agents online.
- Agent cancels after accepting.
**Dependencies:** Self-Pickup, Online Payment

### Online Payment & Escrow
**Description:** Mandatory online payment for delivery orders, held until delivery succeeds.
**User Role:** Buyer, Seller
**Priority:** P1
**Owner:** Both
**Acceptance Criteria:**
- [ ] Razorpay checkout integration.
- [ ] Funds held in Razorpay virtual account.
- [ ] Funds released to seller bank account automatically 2 hours post-delivery.
**Edge Cases:**
- Payment fails or times out.
- Buyer raises dispute within 2 hours.
**Dependencies:** Delivery Flow

### Seller Dashboard
**Description:** Analytics and management screen for users posting multiple items.
**User Role:** Seller
**Priority:** P1
**Owner:** Frontend
**Acceptance Criteria:**
- [ ] Display total earnings, active listings, and pending orders.
- [ ] 1-click relist feature.
**Edge Cases:**
- New seller with no data (empty state).
**Dependencies:** Listing Creation

### Smart Notifications
**Description:** Push notifications for order status, messages, and saved searches.
**User Role:** All users
**Priority:** P1
**Owner:** Both
**Acceptance Criteria:**
- [ ] FCM token registration on login.
- [ ] Backend dispatches targeted push on key events (OTP accepted, message received).
**Edge Cases:**
- User revokes notification permission.
**Dependencies:** Authentication

### Strike System
**Description:** Automated suspension of bad actors.
**User Role:** Admin, System
**Priority:** P1
**Owner:** Backend
**Acceptance Criteria:**
- [ ] Admin can issue a strike.
- [ ] System tracks strike count in User schema.
- [ ] Reaching 3 strikes changes user status to `SUSPENDED` and rejects auth tokens.
**Edge Cases:**
- Strike appeal process.
**Dependencies:** Report System

### AI Price Suggester
**Description:** System looks at title/category and suggests an optimal selling price.
**User Role:** Seller
**Priority:** P2
**Owner:** Both
**Acceptance Criteria:**
- [ ] OpenAI/gemini API integration to estimate typical resale value.
**Edge Cases:**
- Unknown esoteric items.
**Dependencies:** Listing Creation

### Green Score
**Description:** Gamification. Users earn points for items diverted from landfills.
**User Role:** Buyer, Seller
**Priority:** P2
**Owner:** Both
**Acceptance Criteria:**
- [ ] Points awarded post-transaction based on category (Food gives more points than Electronics).
- [ ] Displayed as a leaf badge on profiles.
**Edge Cases:**
- Changing point calculations over time.
**Dependencies:** Ratings & Reviews

### Donate Instead
**Description:** Option to list an item for ₹0, routing it specifically to verified local NGOs.
**User Role:** Seller
**Priority:** P2
**Owner:** Both
**Acceptance Criteria:**
- [ ] Toggle to set price to 0.
- [ ] Only users with `NGO` role can claim it initially.
**Edge Cases:**
- NGOs not available in the area.
**Dependencies:** Listing Creation

### Locality Groups
**Description:** Opt-in neighborhood clusters (e.g., "Bandra West Swappers") for private listings.
**User Role:** All users
**Priority:** P2
**Owner:** Both
**Acceptance Criteria:**
- [ ] Create and join polygon-defined geo-fenced groups.
- [ ] Post listings visible only to group members.
**Edge Cases:**
- User outside polygon trying to spoof GPS.
**Dependencies:** Location Discovery

### Request Board
**Description:** Buyers post what they need ("Looking for a blender"). Sellers can bid.
**User Role:** Buyer, Seller
**Priority:** P2
**Owner:** Both
**Acceptance Criteria:**
- [ ] Buyers post a short request.
- [ ] Matches push notifications to sellers who frequently sell that category.
**Edge Cases:**
- Spam requests.
**Dependencies:** Listing Creation

### B2B Bulk Listings
**Description:** Special flow for bakeries/stores to list 10x of the same item easily.
**User Role:** Verified Seller
**Priority:** P2
**Owner:** Both
**Acceptance Criteria:**
- [ ] 'Quantity' field added to listing schema.
- [ ] Multiple buyers can buy fractions of the listing.
**Edge Cases:**
- Concurrency issues (two buyers buying the last unit simultaneously).
**Dependencies:** Seller Dashboard

### Delivery Agent App
**Description:** A dedicated interface or app solely for gig workers.
**User Role:** Delivery Agent
**Priority:** P2
**Owner:** Frontend
**Acceptance Criteria:**
- [ ] Standalone layout optimized for driving, maps, and high contrast.
**Edge Cases:**
- Low network areas.
**Dependencies:** Delivery Flow

--- FILE: 11_DEV_PLAN.md ---

# Development Plan (14 Weeks)

**Owner:** Both Developers
**Team:** 1 Frontend Developer, 1 Backend Developer

## Phase 1 — MVP (Weeks 1–6)

### Week 1 — Project Setup & Auth
**Frontend:**
- Initialize React & Expo apps.
- Setup Tailwind, routing, and design system tokens.
- Build Login UI (Phone + OTP inputs).
**Backend:**
- Initialize Node/Express, connect MongoDB & Redis.
- Setup User schema.
- Implement `/api/auth/send-otp` and `/verify-otp`.
**End of week deliverable:** User can enter phone, receive real SMS, and get a JWT token.

### Week 2 — Basic Listing CRUD
**Frontend:**
- Build `/sell` multi-step form.
- Integrate Cloudinary widget for image upload.
**Backend:**
- Implement Listing schema.
- Build `POST`, `PUT`, `DELETE` endpoints for `/api/listings`.
**End of week deliverable:** Verified user can post an item and it saves to DB with image URLs.
**Blockers:** Frontend needs API payload structure finalized.

### Week 3 — Browse & Discovery
**Frontend:**
- Build Map view and Grid view on `/browse`.
- Implement Category filters and Location prompt.
**Backend:**
- Implement `GET /api/listings` with 2dsphere geo-queries.
- Seed database with 50 dummy items.
**End of week deliverable:** Feed populates based on user's GPS coordinates.

### Week 4 — Listing Detail & Self-Pickup
**Frontend:**
- Build `/listing/:id` UI.
- Build Checkout card (Self-Pickup only).
**Backend:**
- Implement Order schema.
- Build `POST /api/orders` to create a `PENDING_PICKUP` order and generate OTP.
**End of week deliverable:** Buyer can "Buy" an item and see a 4-digit pickup code.

### Week 5 — Handover & Ratings
**Frontend:**
- Build Seller dashboard to view pending orders.
- Build OTP entry modal for seller.
- Build Rating popup.
**Backend:**
- Implement `/confirm-pickup` endpoint.
- Implement Review schema and `POST /api/reviews`.
**End of week deliverable:** End-to-end self-pickup loop completed and rated.

### Week 6 — MVP Polish & Launch
**Frontend:**
- Polish empty states, loading skeletons, and error toasts.
**Backend:**
- Implement price cap (80% MRP) validation.
- Implement Expiry cron job.
**End of week deliverable:** V1 deployed to staging. Internal QA testing.

---

## Phase 2 — Growth (Weeks 7–10)

### Week 7 — Delivery Logistics
**Frontend:**
- Update Checkout to show Delivery option.
- Build `FulfillmentToggle` and integrate Google Maps distance display.
**Backend:**
- Integrate Google Maps Distance Matrix API.
- Update `/api/orders` to calculate delivery fee.
**End of week deliverable:** System accurately quotes a delivery fee based on distance.

### Week 8 — Payments & Escrow
**Frontend:**
- Integrate Razorpay SDK on checkout.
**Backend:**
- Implement `/api/payments/initiate` and webhook handler.
- Setup escrow routing logic.
**End of week deliverable:** Buyer pays online, funds sit in Razorpay Escrow.

### Week 9 — In-App Chat
**Frontend:**
- Build `/inbox` and individual chat thread UI.
**Backend:**
- Setup Socket.io server.
- Implement Message schema and history endpoints.
**End of week deliverable:** Real-time text messaging between buyer and seller.

### Week 10 — Notifications & Dashboard
**Frontend:**
- Implement Expo Push Notifications.
- Finalize Seller Dashboard charts.
**Backend:**
- Setup FCM admin SDK.
- Dispatch pushes on message receive and order updates.
**End of week deliverable:** Phone buzzes when a new message arrives.

---

## Phase 3 — Polish (Weeks 11–14)

### Week 11 — Admin & Disputes
**Frontend:**
- Build React Web Admin panel (Reports table, User list).
**Backend:**
- Implement Report schema and `/api/admin` endpoints.
- Dispute workflow logic.
**End of week deliverable:** Admin can see flagged items and suspend users.

### Week 12 — Strike System & Green Score
**Frontend:**
- Add Green score leaf badge to profiles.
**Backend:**
- Implement 3-strike logic and auto-suspension.
- Calculate and award Green Score points post-transaction.
**End of week deliverable:** Bad actors are banned; good actors get points.

### Week 13 — Performance & Testing
**Frontend:**
- Optimize React renders, lazy loading.
- E2E tests for core checkout flow.
**Backend:**
- Add database indexes, optimize geo-queries.
- Load testing with Artillery.
**End of week deliverable:** App handles 1000 concurrent simulated users.

### Week 14 — Launch Prep
**Frontend:**
- App store metadata, screenshots.
**Backend:**
- Final security audit, backup configurations.
**End of week deliverable:** Production deployment. Go live.

---

## Team Processes

### Git Branching
- `main`: Production ready.
- `develop`: Staging environment.
- `feature/name-of-feature`: Daily work branches.
- `hotfix/description`: Production bugs.

### PR Review (2-Person Team)
- Frontend reviews Backend PRs for API contract accuracy.
- Backend reviews Frontend PRs for edge-case handling.
- Mandatory 1 approval before merge to `develop`.

### Definition of Done (DoD)
- Code is linted and formatted.
- Unit tests pass.
- Endpoints are documented in Postman collection.
- Feature tested manually on both iOS and Android simulators.

### Weekly Sync
- **When:** Monday 10:00 AM (30 mins).
- **Agenda:** 
  1. What did we ship last week?
  2. What are we building this week?
  3. Are there API contract blockers?

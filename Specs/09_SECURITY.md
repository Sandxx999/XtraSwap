--- FILE: 09_SECURITY.md ---

# Security & Trust Guidelines

**Owner:** Backend Developer (Frontend reviews for UX implications)

## 1. Authentication & OTP Flow
- **Generation:** Cryptographically secure 6-digit random number.
- **Storage:** Stored in Redis against the phone number key.
- **TTL (Time to Live):** 5 minutes.
- **Attempt Limits:** Maximum 3 incorrect guesses before the OTP is invalidated.
- **Resend Cooldown:** 60 seconds minimum between resend requests.
- **Rate Limiting:** Maximum 3 OTP generation requests per hour per IP/Phone number to prevent SMS toll fraud.

## 2. JWT Strategy
- **Access Token:** Short-lived (15 minutes). Sent in `Authorization: Bearer` header.
- **Refresh Token:** Long-lived (30 days). Stored in a secure, `HttpOnly`, `SameSite=Strict` cookie.
- **Rotation:** Refresh tokens are rotated upon use. Old refresh token is invalidated.
- **Revocation:** On logout or password reset/account suspension, all active refresh tokens for the user are deleted from the database.

## 3. Escrow & Payment Rules
- **When Held:** Funds are captured via Razorpay at checkout and held in a Razorpay Route virtual account (Escrow).
- **Release Conditions:** 
  1. Delivery OTP is successfully verified by the agent.
  2. The 2-hour dispute window expires with no active dispute.
- **Auto-release Timer:** A Bull queue job is scheduled for exactly 2 hours after the `COMPLETED` timestamp.
- **Refund Triggers:** If a dispute is resolved in favor of the buyer, the API calls Razorpay's refund endpoint.

## 4. Strike & Suspension System
- **Triggers:**
  - Seller no-show (verified by buyer/agent report).
  - Listing prohibited items (weapons, drugs, adult content).
  - Excessive canceled orders (>3 in a week).
- **Thresholds:**
  - 1 Strike: Warning notification + email.
  - 2 Strikes: Temporary shadow-ban (listings hidden for 48 hours).
  - 3 Strikes: Permanent suspension.
- **Suspension Action:** `status` set to `SUSPENDED`. Active JWTs blacklisted. Account phone number blocked from re-registering.
- **Appeal:** Manual email to support with evidence.

## 5. Location Privacy
- **Browsing Phase:** Buyers only see the distance (e.g., "1.2 km away") and an approximate 500m radius circle on the map. Exact address/coordinates are never sent to the frontend.
- **Ordered Phase (Pickup):** Seller's exact address is revealed to the buyer only after the order status becomes `PENDING_PICKUP`.
- **Ordered Phase (Delivery):** Seller's exact address is revealed to the agent upon accepting the job. Buyer's exact address is revealed to the agent only after the Pickup OTP is verified.

## 6. Price Cap Validation
- **Rule:** Selling price must be ≤ 80% of stated MRP.
- **Enforcement:** Enforced at the Mongoose schema level (`pre-save` hook) and at the API controller level.
- **MRP Verification:** For MVP, relies on user honesty and community reporting. P1 feature will require a photo of the MRP tag for high-value items.
- **Bypass Attempts:** Backend sanitizes inputs to ensure `price` and `mrp` are positive integers.

## 7. Input Validation & API Security
- **Library:** `Zod` (Frontend & Backend validation).
- **Rules:** No HTML tags allowed in descriptions (prevent XSS). Phone numbers must match E.164 format.
- **Rate Limiting:**
  - Listings: 5 per day for new users, 50 for verified users.
  - Reports: 10 per day per user (prevent malicious flagging).

## 8. Image Upload Security
- **Provider:** Cloudinary.
- **File Type:** Strictly `.jpg`, `.jpeg`, `.png`, `.webp`.
- **Size Limit:** Max 5MB per image.
- **Live-capture Enforcement:** In P1, mobile app will force the use of the native camera for at least one photo (preventing users from uploading stock photos of items they don't own).

## 9. Payment Security
- **Webhooks:** All Razorpay webhooks must be verified using the `x-razorpay-signature` header and the webhook secret.
- **Idempotency:** API endpoints handling payments require an Idempotency Key header to prevent double-charging on network retries.

## 10. Audit Logging & Compliance
- **Admin Actions:** Every state change made by an Admin (resolving reports, issuing strikes) is logged in an `AuditLog` collection.
- **Data Deletion:** Soft deletes are used for records tied to financial transactions. A dedicated endpoint allows users to request complete PII deletion in compliance with the India DPDP Act.
- **Data Localization:** MongoDB Atlas cluster deployed in `ap-south-1` (Mumbai) to comply with data residency requirements.

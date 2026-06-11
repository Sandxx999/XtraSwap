--- FILE: 01_PROJECT_OVERVIEW.md ---

# Project Overview: XtraSwap

## 1. Core Identity
- **App Name:** XtraSwap
- **Tagline:** Your Neighborhood Re-commerce Marketplace.
- **One-Liner:** A hyperlocal platform connecting neighbors to buy, sell, and exchange surplus groceries, electronics, and household items at discounted prices, fostering a sustainable and connected community.

## 2. Problem Statement
In urban neighborhoods, households and small businesses frequently end up with surplus goods—such as excess groceries, slightly used electronics, or perfectly good household items. These items often go to waste due to a lack of convenient, localized, and trustworthy channels to sell or donate them. Existing platforms are too broad, involve high shipping costs, or lack the immediacy required for perishable or low-cost surplus items.

## 3. Solution Summary
XtraSwap provides a hyper-local marketplace app tailored for immediate neighborhood transactions. It enables users to quickly list surplus items, and buyers to discover discounted goods within a short radius. By offering flexible fulfillment options (free self-pickup or low-cost, distance-based delivery) and built-in trust mechanisms (OTP verification, ratings), XtraSwap makes local re-commerce seamless, reducing waste and saving money.

## 4. Target Audience
### Primary Audience
- **Bargain Hunters & Students:** Individuals looking for affordable groceries, electronics, and daily essentials.
- **Eco-conscious Households:** Families and individuals looking to reduce waste by selling or buying surplus items.
- **Gig Economy Workers:** Local delivery agents seeking short-distance, quick-turnaround delivery tasks.

### Secondary Audience
- **Small Local Businesses (e.g., bakeries, local grocers):** Looking to liquidate end-of-day surplus inventory quickly.
- **Upcyclers & DIY Enthusiasts:** Looking for cheap electronics or furniture to repair and reuse.

## 5. Key Value Propositions
### For Sellers
- **Quick Liquidation:** Turn surplus goods into cash instantly.
- **Zero Shipping Hassle:** Buyers pick up, or local agents deliver.
- **Community Building:** Support neighbors and reduce local waste.

### For Buyers
- **Deep Discounts:** Access to goods at significantly lower prices than retail.
- **Instant Gratification:** Same-day, immediate local pickup or delivery.
- **Hyperlocal Discovery:** Find what you need just a few blocks away.

### For Delivery Agents
- **Short-Distance Gigs:** High volume of quick, localized trips.
- **Predictable Earnings:** Transparent distance-based fee structure.

## 6. Monetization Model
- **Platform Commission:** 5% cut on every successful transaction.
- **Delivery Fee Cut:** 10% platform share of the distance-based delivery fee.
- **Premium Listing Boost (Paid):** Sellers can pay a micro-fee to highlight their listing at the top of local search results.
- **Verified Seller Badge (Paid/Subscription):** A premium tier for high-volume sellers or local businesses to build trust and gain visibility.

## 7. Success Metrics
- **DAU (Daily Active Users):** Measure platform engagement and stickiness.
- **Listings per Day:** Indicator of seller acquisition and inventory health.
- **GMV (Gross Merchandise Value):** Total value of goods sold through the platform.
- **Dispute Rate:** Percentage of orders ending in disputes (target < 2%) to measure platform trust and item quality.
- **Fulfillment Ratio:** Percentage of completed vs. cancelled orders.

## 8. Scope
### IN Scope for v1 (MVP)
- User registration and authentication (Phone + OTP).
- Creating listings with photos, expiry dates, and categories.
- Location-based discovery and basic search/filtering.
- Self-pickup fulfillment with OTP confirmation.
- Distance-based delivery fulfillment using local agents.
- Basic in-app messaging between buyer and seller.
- Cash payments and basic Razorpay integration for platform fees/escrow.
- Rating and review system.
- Reporting system for flagged listings.

### OUT of Scope for v1
- AI price suggester for listings.
- "Green Score" gamification and leaderboards.
- "Donate Instead" feature integration with local NGOs.
- Locality/community groups and forums.
- Request Board (users posting what they are looking for).
- B2B bulk listing management dashboard.
- Separate dedicated Delivery Agent mobile app (will use a unified app with role-based UI for MVP).

## 9. Competitive Landscape
| Competitor | Their Focus | How XtraSwap Differs |
| :--- | :--- | :--- |
| **OLX / Quikr** | Broad classifieds, high-value items (cars, real estate). | Hyper-local focus, integrated delivery, optimized for low-value/surplus items (food, groceries). |
| **Facebook Marketplace** | Social discovery, no integrated payment/delivery. | End-to-end transaction safety (OTP, Escrow), structured delivery logistics, anonymous but verified trust. |
| **Too Good To Go** | Restaurant/retail surplus food only. | P2P focus (household surplus) + electronics/goods, not just commercial food waste. |
| **Swiggy/Zepto (Instamart)** | Q-commerce retail delivery. | Re-commerce (C2C), focus on surplus/discounted, not retail inventory. |

## 10. App Platforms
- **Web App:** Built with React, Tailwind CSS, and Shadcn UI (optimized for browsing and admin tasks).
- **Mobile App:** Built with React Native & Expo (primary platform for buyers, sellers, and delivery agents, leveraging native camera and location APIs).

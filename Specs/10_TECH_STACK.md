--- FILE: 10_TECH_STACK.md ---

# Tech Stack

**Owner:** Both Developers

## 1. Full Stack Overview
| Layer | Technology | Version | Purpose | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web** | React | 18 | Admin panel, web browsing | Frontend |
| **Styling** | Tailwind CSS | 3.4 | Utility-first styling | Frontend |
| **UI Components**| shadcn/ui | latest | Accessible base components | Frontend |
| **State Mgt** | Zustand / React Query | latest | Client state / Server state | Frontend |
| **Form/Validation**| React Hook Form + Zod | latest | Form handling and validation | Frontend |
| **Mobile App** | React Native + Expo | SDK 51 | Cross-platform mobile app | Frontend |
| **Backend API** | Node.js + Express | 20 / 4 | Core REST API server | Backend |
| **Database** | MongoDB + Mongoose | 7 / 8 | Primary data store | Backend |
| **Cache/Queue** | Redis + Bull | 7 / latest | OTP storage, cron jobs | Backend |
| **Real-time** | Socket.io | latest | Chat, live tracking, jobs | Both |

## 2. External Services
| Service | Purpose | Why Chosen | Free Tier Limits |
| :--- | :--- | :--- | :--- |
| **Firebase Auth / Twilio** | SMS OTP | Firebase is cheaper/free for phone auth, Twilio as fallback. | 10k/month (Firebase) |
| **Razorpay** | Payments & Escrow | Best documentation and API for Indian market + native Escrow support. | Standard tx fees |
| **Cloudinary** | Image Hosting | On-the-fly compression and transformation via URL. | 25 Credits/mo |
| **Google Maps API**| Geocoding & Distance | Reliable distance matrix for delivery fee calculations. | $200/mo credit |
| **Firebase FCM** | Push Notifications | Industry standard, free, easy Expo integration. | Free |

## 3. DevOps & Infrastructure
- **Frontend Hosting:** Vercel (Web app & admin panel). Fast edge network.
- **Backend Hosting:** Railway.app. Easy Docker deployment, scalable.
- **Database Hosting:** MongoDB Atlas (Shared Cluster initially, scale to Dedicated).
- **Cache Hosting:** Redis Enterprise Cloud.
- **CDN:** Cloudflare (for DNS and asset caching).
- **CI/CD:** GitHub Actions (Automated linting, testing, and deployment triggers).

## 4. Development Tools
- **Linting & Formatting:** ESLint + Prettier.
- **Git Hooks:** Husky (pre-commit hooks to ensure linting).
- **Testing (Backend):** Jest + Supertest (API endpoint testing).
- **Testing (Frontend):** React Testing Library + Jest.
- **API Documentation:** Postman / Swagger (Auto-generated via code annotations).

## 5. Required Environment Variables
*(Do not put real values here. This is a checklist for setup.)*

### Backend (`.env`)
```
PORT=
NODE_ENV=
MONGODB_URI=
REDIS_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GOOGLE_MAPS_API_KEY=
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_API_BASE_URL=
```

## 6. Local Setup Steps
1. Clone the repository.
2. Ensure Node.js 20+ is installed.
3. Install Redis locally or use a Docker container.
4. Copy `.env.example` to `.env` in both `/frontend` and `/backend` directories.
5. In `/backend`: run `npm install`, then `npm run dev`.
6. In `/frontend`: run `npm install`, then `npm run dev` (for web) or `npx expo start` (for mobile).

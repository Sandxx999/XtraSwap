--- FILE: README.md ---

# XtraSwap 🔄

**Your Neighborhood Re-commerce Marketplace**
*Connecting neighbors to buy, sell, and exchange surplus groceries, electronics, and household items at discounted prices.*

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📚 Project Specifications Index

This project uses a modular specification structure. For a new team member, it is recommended to read these documents in the order listed below.

| File | Description |
| :--- | :--- |
| [01_PROJECT_OVERVIEW.md](./01_PROJECT_OVERVIEW.md) | The "Why": Problem, solution, audience, and MVP scope. |
| [02_USER_PERSONAS.md](./02_USER_PERSONAS.md) | Profiles for Priya (Seller), Arjun (Buyer), Ravi (B2B), and Sneha (Agent). |
| [03_USER_FLOWS.md](./03_USER_FLOWS.md) | Step-by-step logic for 10 core system behaviors. |
| [04_FEATURES.md](./04_FEATURES.md) | Granular list of P0/P1/P2 features with acceptance criteria. |
| [05_DATABASE_SCHEMA.md](./05_DATABASE_SCHEMA.md) | MongoDB Mongoose collections, indexes, and relationships. |
| [06_API_ENDPOINTS.md](./06_API_ENDPOINTS.md) | The REST API contract (Requests, Responses, Errors). |
| [07_DESIGN_SYSTEM.md](./07_DESIGN_SYSTEM.md) | CSS tokens, typography, and component specifications. |
| [08_PAGE_SPECS.md](./08_PAGE_SPECS.md) | UI layout, states, and API integrations for every screen. |
| [09_SECURITY.md](./09_SECURITY.md) | Auth, payments, data privacy, and abuse prevention. |
| [10_TECH_STACK.md](./10_TECH_STACK.md) | Full stack tools, external services, and CI/CD. |
| [11_DEV_PLAN.md](./11_DEV_PLAN.md) | 14-week timeline, branching strategy, and team processes. |

---

## 👥 Responsibility Matrix

This project is built by a 2-person engineering team.

| Domain | Owner | Primary Responsibilities |
| :--- | :--- | :--- |
| **Frontend & Mobile** | Dev 1 | React, React Native, UI/UX, State Management, Map integrations. |
| **Backend & Infra** | Dev 2 | Node.js, API, Database, Redis, Sockets, Payments (Razorpay), Auth. |
| **Architecture** | Both | API Contracts, Tech Stack decisions, Schema reviews. |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v20+)
- MongoDB (Local or Atlas URL)
- Redis (Local or Cloud URL)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Add your local DB/Redis URIs
npm run dev
```

### 2. Frontend Setup (Web)
```bash
cd frontend
npm install
cp .env.example .env # Add local backend URL
npm run dev
```

### 3. Mobile Setup (React Native)
```bash
cd mobile
npm install
cp .env.example .env 
npx expo start
```

---

## 🔑 Environment Variables
*(Do not commit actual values. Use these as a checklist)*

**Backend:** `PORT`, `NODE_ENV`, `MONGODB_URI`, `REDIS_URI`, `JWT_SECRET`, `TWILIO_SID`, `CLOUDINARY_API_KEY`, `RAZORPAY_KEY_ID`, `GOOGLE_MAPS_API_KEY`
**Frontend:** `VITE_API_BASE_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_GOOGLE_MAPS_API_KEY`

---

## 🎨 Design Assets
- [Figma Wireframes (Placeholder)](https://figma.com/file/placeholder)
- [Logo & Branding (Placeholder)](https://drive.google.com/drive/placeholder)

---

## 🤝 Contributing
1. Assign yourself an issue from the Kanban board.
2. Checkout a branch from `develop` (`feature/your-feature`).
3. Commit often using semantic commit messages.
4. Open a PR against `develop` and request a review from your teammate.
5. Merge only when CI passes and 1 approval is granted.

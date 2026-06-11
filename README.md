# XtraSwap - Neighborhood Re-commerce Marketplace

XtraSwap is a hyper-local marketplace for selling and buying surplus groceries, electronics, and household items.

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT Auth

## Features
- **Listing & Discovery:** Post items with categories, price, and expiry dates.
- **Modern UI:** Clean, polished design using Shadcn UI components.
- **Authentication:** Secure user registration and login.
- **Local Focus:** Designed for hyper-local neighborhood transactions.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB running locally or a MongoDB Atlas connection string.

### Setup

1. **Backend Setup:**
   - Open a terminal in `XtraSwap/backend`.
   - Run `npm install`.
   - Ensure the `.env` file has your correct `MONGODB_URI`.
   - Run `npm run dev` to start the backend server on port 5000.

2. **Frontend Setup:**
   - Open another terminal in `XtraSwap/frontend`.
   - Run `npm install`.
   - Run `npm run dev` to start the frontend development server.
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `/backend`: Express API with Mongoose models, controllers, and routes.
- `/frontend`: React application with Shadcn UI components and polished pages.

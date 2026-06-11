--- FILE: 06_API_ENDPOINTS.md ---

# API Endpoints

**Owner:** Backend Developer (Frontend Developer reads to integrate)

## Base Conventions
- **Base URL:** `/api/v1`
- **Auth Header:** `Authorization: Bearer <token>`
- **Pagination:** `?page=1&limit=20`
- **Error Format:** `{ "error": true, "code": "ERR_CODE", "message": "Human readable message" }`
- **Success Format:** `{ "error": false, "data": { ... } }`

## 1. Authentication
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | No | Request OTP to phone number |
| `POST` | `/api/auth/verify-otp` | No | Verify OTP and get JWT |
| `POST` | `/api/auth/refresh-token` | Yes | Get new access token |
| `POST` | `/api/auth/logout` | Yes | Invalidate token |

### Endpoint Details
**POST /api/auth/verify-otp**
- **Req:** `{ "phone": "+919876543210", "otp": "123456" }`
- **Res:** `{ "token": "jwt_string", "user": { "id": "...", "isNew": true } }`
- **Errors:** `400 INVALID_OTP`, `429 RATE_LIMIT_EXCEEDED`

## 2. Users
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Yes | Get current user profile |
| `PUT` | `/api/users/profile` | Yes | Update name/avatar |
| `GET` | `/api/users/:id/public` | Yes | Get public profile of another user |
| `DELETE` | `/api/users/account` | Yes | Soft delete account |

### Endpoint Details
**PUT /api/users/profile**
- **Req:** `{ "name": "Arjun", "avatarUrl": "url..." }`
- **Res:** `{ "user": { ...updated profile... } }`
- **Errors:** `400 VALIDATION_ERROR`

## 3. Listings
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/listings` | Yes | Create a new listing |
| `GET` | `/api/listings` | Yes | Search/discover listings (geo-spatial) |
| `GET` | `/api/listings/:id` | Yes | Get single listing details |
| `PUT` | `/api/listings/:id` | Yes | Update a listing |
| `DELETE`| `/api/listings/:id` | Yes | Delete a listing |
| `GET` | `/api/listings/seller/:id` | Yes | Get listings by specific seller |
| `POST` | `/api/listings/:id/report` | Yes | Report a listing |
| `PUT` | `/api/listings/:id/donate` | Yes | Toggle donate-instead flag (P2) |

### Endpoint Details
**GET /api/listings**
- **Query Params:** `?lat=17.38&lng=78.48&radius=5&category=GROCERIES&sort=price_asc`
- **Res:** `{ "listings": [ { "id": "...", "title": "...", "distanceInKm": 1.2 } ], "total": 45 }`
- **Errors:** `400 MISSING_GEO_PARAMS`

**POST /api/listings**
- **Req:** `{ "title": "Apples", "category": "GROCERIES", "price": 50, "mrp": 100, "condition": "NEW", "images": ["url1"], "fulfillmentOptions": ["PICKUP"] }`
- **Res:** `{ "listing": { ... } }`
- **Errors:** `400 PRICE_CAP_EXCEEDED`, `400 VALIDATION_ERROR`

## 4. Orders
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Yes | Create an order (Buy item) |
| `GET` | `/api/orders/:id` | Yes | Get order details |
| `PUT` | `/api/orders/:id/status` | Yes | Update order status |
| `POST` | `/api/orders/:id/confirm-pickup` | Yes | Seller confirms pickup via OTP |
| `POST` | `/api/orders/:id/confirm-delivery`| Yes | Buyer confirms delivery via OTP |
| `POST` | `/api/orders/:id/dispute` | Yes | Raise a dispute |

### Endpoint Details
**POST /api/orders/:id/confirm-pickup**
- **Req:** `{ "otp": "4812" }`
- **Res:** `{ "order": { "status": "COMPLETED" } }`
- **Errors:** `400 INVALID_OTP`, `403 UNAUTHORIZED`

## 5. Payments
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/initiate` | Yes | Create Razorpay order for delivery fee |
| `POST` | `/api/payments/webhook` | No | Razorpay webhook handler |
| `POST` | `/api/payments/release-escrow` | Admin | Manually/Cron release escrow to seller |
| `POST` | `/api/payments/refund` | Admin | Refund buyer |

### Endpoint Details
**POST /api/payments/initiate**
- **Req:** `{ "orderId": "..." }`
- **Res:** `{ "razorpayOrderId": "order_rcptid_11", "amount": 15000, "currency": "INR" }`

## 6. Chat
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chat/conversations` | Yes | Get list of user's active chats |
| `GET` | `/api/chat/messages/:convId` | Yes | Get messages in a conversation |
| `POST` | `/api/chat/messages` | Yes | Send a message via REST (fallback) |
| `PUT` | `/api/chat/messages/:convId/read` | Yes | Mark conversation as read |

*(Note: Real-time messaging handled via Socket.io events: `join_room`, `send_message`, `receive_message`, `typing`)*

## 7. Reviews
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Yes | Create a rating/review |
| `GET` | `/api/reviews/user/:userId` | Yes | Get all reviews for a user |

## 8. Delivery (P1)
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/delivery/jobs` | Agent | Get available jobs nearby |
| `POST` | `/api/delivery/jobs/:id/accept` | Agent | Accept a delivery job |
| `PUT` | `/api/delivery/location` | Agent | Update agent's live location |
| `POST` | `/api/delivery/jobs/:id/complete`| Agent | Complete delivery (Verify Delivery OTP) |

## 9. Notifications
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Yes | Get user's notifications |
| `PUT` | `/api/notifications/:id/read` | Yes | Mark single as read |
| `PUT` | `/api/notifications/read-all` | Yes | Mark all as read |

## 10. Admin
| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/reports` | Admin | Get all flagged items |
| `POST` | `/api/admin/reports/:id/resolve` | Admin | Resolve a report |
| `POST` | `/api/admin/users/:id/suspend` | Admin | Manually suspend user |
| `GET` | `/api/admin/stats` | Admin | Get platform metrics |

## Rate Limiting Rules
- `/api/auth/send-otp`: 3 per hour per IP/Phone.
- `/api/listings` (POST): 10 per day for unverified users, 50 for verified.
- `/api/listings/:id/report`: 10 per day per user.

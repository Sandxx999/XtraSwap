--- FILE: 07_DESIGN_SYSTEM.md ---

# Design System

**Owner:** Frontend Developer

## 1. Color Tokens
```css
:root {
  --color-primary: #10b981; /* Emerald 500 */
  --color-primary-dark: #047857; /* Emerald 700 */
  --color-accent: #f59e0b; /* Emerald 500 */
  --color-warning: #f59e0b; /* Amber 500 */
  --color-danger: #ef4444; /* Red 500 */
  --color-bg: #f9fafb; /* Gray 50 */
  --color-surface: #ffffff; /* White */
  --color-surface-alt: #f3f4f6; /* Gray 100 */
  --color-text-primary: #111827; /* Gray 900 */
  --color-text-secondary: #6b7280; /* Gray 500 */
  --color-border: #e5e7eb; /* Gray 200 */
}
```

## 2. Typography Scale (Tailwind)
- **H1 (Page Title):** `text-3xl font-bold tracking-tight` (30px)
- **H2 (Section Title):** `text-2xl font-semibold` (24px)
- **H3 (Card Title):** `text-lg font-medium` (18px)
- **Body (Primary):** `text-base font-normal` (16px)
- **Body (Secondary):** `text-sm text-gray-500` (14px)
- **Caption (Tags/Time):** `text-xs font-medium uppercase` (12px)

## 3. Spacing Scale
Uses standard Tailwind spacing:
- `p-1` (4px)
- `p-2` (8px)
- `p-3` (12px)
- `p-4` (16px) - *Default container padding*
- `p-6` (24px)
- `p-8` (32px)

## 4. Border Radius
- **Buttons / Inputs:** `rounded-md` (6px)
- **Cards / Images:** `rounded-xl` (12px)
- **Bottom Sheet / Modals:** `rounded-t-2xl` (16px top only)
- **Avatars:** `rounded-full` (9999px)

## 5. Shadow Scale
- **sm:** `0 1px 2px 0 rgb(0 0 0 / 0.05)` (Navbars)
- **md:** `0 4px 6px -1px rgb(0 0 0 / 0.1)` (Cards)
- **lg:** `0 10px 15px -3px rgb(0 0 0 / 0.1)` (Dropdowns)
- **xl:** `0 20px 25px -5px rgb(0 0 0 / 0.1)` (Modals)

## 6. Component Specs

### Button
- **Variants:** `primary` (Solid Green), `secondary` (Outline Gray), `ghost` (Text only), `danger` (Solid Red).
- **Props:** `size="sm|md|lg"`, `isLoading={boolean}`, `icon={ReactNode}`
- **Tailwind (Primary):** `bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md px-4 py-2 transition-colors`
- **Do:** Use full width on mobile for primary CTAs.
- **Don't:** Use multiple primary buttons on the same screen.

### Input
- **Variants:** `text`, `search`, `textarea`, `price` (with ₹ prefix).
- **Tailwind:** `border border-gray-200 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`

### OTPInput
- **Description:** 6 discrete boxes for OTP entry.
- **State:** Auto-focuses next box on typing. Errs turn borders red `border-red-500`.

### ListingCard
- **Variants:** `default`, `skeleton` (shimmer loading).
- **Elements:**
  - 16:9 Image (top).
  - Condition Badge (overlay top-left).
  - Title (1 line truncate).
  - Price & MRP (strikethrough) side-by-side.
  - Distance ("1.2 km away") & Time posted.
- **States:** Hover adds `shadow-md`, Sold overlays dark semi-transparent mask.

### Badge
- **Variants:** 
  - *Condition:* Gray BG.
  - *Category:* Blue/Purple BG.
  - *Discount %:* Red BG, white text.
  - *Verified:* Green BG with check icon.

### BottomNav (Mobile)
- **Elements:** 4 Tabs (Home, Search, Sell (+), Inbox, Profile).
- **States:** Active tab icon filled and colored `text-emerald-500`, inactive outlined `text-gray-500`.

### FulfillmentToggle
- **Description:** Segmented control to choose between Pickup and Delivery.
- **Active State:** Green border, slightly tinted background `bg-emerald-50`.

### ChatBubble
- **Variants:** `sent` (emerald bg, right aligned), `received` (gray bg, left aligned).
- **Metadata:** Tiny timestamp at the bottom corner. Double checkmark for read receipt (sent only).

### SkeletonCard
- **Animation:** `animate-pulse bg-gray-200` to simulate layout while data fetches.

### ToastNotification
- **Variants:** `success` (green), `error` (red), `info` (gray).
- **Behavior:** Slides up from bottom, auto-dismisses in 3 seconds.

### RatingStars
- **Display:** 5 stars. Solid yellow `text-amber-500` for filled, outline gray for empty. Supports half-stars.
- **Interactive:** Hover states fill stars up to cursor position.

### GreenScoreBadge
- **Display:** A small leaf icon next to a number.
- **Tooltip:** On hover, explains "Points earned by saving items from landfill".

# 🍱 CanteenGo
### *Order ahead. Skip the queue.*

A full-stack college canteen pre-booking platform that eliminates lunch-hour queues by letting students pre-order meals, pay digitally, and collect food using a unique one-time QR token.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Academic Context](#academic-context)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

College canteens serve hundreds of students within a narrow 45–60 minute lunch window daily. The complete absence of a structured pre-ordering system leads to:

- ⏳ 30–40 minute queue times
- 🗑️ Food wastage due to unpredictable demand
- 💸 Billing errors and cash handling delays
- 😓 Stressful experience for students and staff alike

**CanteenGo** solves this by giving students a digital-first ordering experience — browse the menu from class, pre-order, pay online, and walk straight to the counter to collect using a QR token.

---

## Features

### 🎓 Student
- Register with college email and department
- Browse daily digital menu with categories, prices, calories, and availability
- Add items to cart (max 10 items per order)
- Select a pickup time slot with real-time capacity display (e.g. 32/50)
- Pay via **Canteen Wallet** or **Cash-on-Pickup**
- Receive a **unique one-time QR token** after payment
- Track order status in real-time: `Placed → Preparing → Ready → Collected`
- Cancel orders (up to 10 minutes before slot) with automatic wallet refund
- Rate and review food items after collection
- Full order history

### 👨‍🍳 Canteen Staff
- Real-time kitchen order board grouped by pickup slot
- View order details: student name, items, slot time, payment mode
- Mark orders as `Preparing` and `Ready`
- Triggers live status update to student's app

### 🧾 Cashier
- Enter or scan QR token to validate order
- View order details on successful validation
- Mark order as `Collected` — token is immediately invalidated (one-time use)
- Error handling for invalid, expired, or already-used tokens

### ⚙️ Admin
- Full **menu management** — add, edit, delete items; toggle availability
- **Time slot management** — create slots with capacity limits; activate/deactivate
- **Analytics dashboard**:
  - Daily and weekly revenue
  - Top 5 selling items (bar chart)
  - Orders by time slot (bar chart)
  - Order status breakdown (pie chart)
- User management — view all registered students

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + React Router v6 |
| Styling | Tailwind CSS + Shadcn/ui |
| Backend / DB | Supabase (PostgreSQL + Auth + Realtime) |
| Charts | Recharts |
| QR Code | qrcode.react |
| Hosting | Vercel / Netlify |

---

## System Architecture

CanteenGo follows a **3-Tier Client-Server Architecture**:

```
┌─────────────────────────────────────────────┐
│             PRESENTATION LAYER              │
│  Student App │ Staff Dashboard │ Admin Panel │
└──────────────────────┬──────────────────────┘
                       │ REST API / HTTP
┌──────────────────────▼──────────────────────┐
│             APPLICATION LAYER               │
│  Auth │ Menu │ Order │ Slot │ Payment │ QR  │
└──────────────────────┬──────────────────────┘
                       │ SQL / ORM
┌──────────────────────▼──────────────────────┐
│               DATA LAYER                    │
│     Supabase PostgreSQL (RLS enabled)       │
│  Users │ Orders │ Menu │ Slots │ Payments   │
└─────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/canteengo.git
cd canteengo

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and publishable key (see below)

# 4. Set up the database
# Run the SQL schema file in your Supabase SQL editor:
# /supabase/schema.sql

# 5. Seed demo data
# Run the seed file in your Supabase SQL editor:
# /supabase/seed.sql

# 6. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

You can find these in your Supabase project under **Settings → API**.

---

## Database Schema

```sql
users          -- id, name, email, role, dept, phone, wallet_balance
menu_items     -- id, name, category, price, calories, image_url, is_available, avg_rating
time_slots     -- id, date, start_time, end_time, max_capacity, current_count, is_active
orders         -- id, student_id, slot_id, status, total_amount, qr_token, payment_mode
order_items    -- id, order_id, menu_item_id, quantity, price
payments       -- id, order_id, amount, mode, status, transaction_id, timestamp
notifications  -- id, student_id, order_id, message, type, is_read, timestamp
ratings        -- id, student_id, menu_item_id, order_id, rating, review
```

**Realtime** is enabled on `orders` and `notifications` tables for live status updates.

Row-Level Security (RLS) policies are applied per role — students can only read their own orders; staff can read all orders but not user data; admin has full access.

---

## User Roles

| Role | Access |
|---|---|
| `student` | Menu, Cart, Orders, QR Token, Ratings |
| `staff` | Kitchen Dashboard (read + update order status) |
| `cashier` | QR Token Validation Portal |
| `admin` | Full access — Menu, Slots, Analytics, Users |

### Demo Credentials (for testing)

| Role | Email | Password |
|---|---|---|
| Student | student@college.edu | demo1234 |
| Staff | staff@canteengo.in | demo1234 |
| Cashier | cashier@canteengo.in | demo1234 |
| Admin | admin@canteengo.in | demo1234 |

---

## Project Structure

```
canteengo/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Shadcn/ui base components
│   │   ├── MenuCard.jsx
│   │   ├── OrderCard.jsx
│   │   ├── QRToken.jsx
│   │   └── SlotPicker.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── OrderStatus.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── Staff/
│   │   │   └── KitchenDashboard.jsx
│   │   ├── Cashier/
│   │   │   └── TokenValidator.jsx
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── MenuManager.jsx
│   │       ├── SlotManager.jsx
│   │       └── Analytics.jsx
│   ├── lib/
│   │   ├── supabase.js     # Supabase client
│   │   └── utils.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useOrders.js
│   │   └── useRealtime.js
│   ├── context/
│   │   └── AuthContext.jsx
│   └── App.jsx
├── supabase/
│   ├── schema.sql          # Full DB schema
│   └── seed.sql            # Demo data
├── .env.example
├── tailwind.config.js
└── package.json
```

---

## Academic Context

This project was developed as part of a **Software Engineering** course and covers the complete SDLC:

| Experiment | Deliverable |
|---|---|
| 1 | Problem Statement & Feasibility Analysis |
| 2 | SRS Document, System Architecture, DFD, Test Plan |
| 3 | Software Configuration Management Plan (SCMP) + Risk Register |
| 4 | UML as a CASE Tool — study of all 14 UML diagram types |
| 5 | UML Diagrams — Use Case, Class, Sequence, Object, Component, State Machine |
| 6 | Unit Testing & Integration Testing (25 unit + 10 integration test cases) |
| 7 | Black Box Testing (EP, BVA, Decision Table) + White Box Testing (Statement, Branch, Path, Loop Coverage) |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit with conventional commits
git commit -m "feat: add coupon code support"

# Push and open a PR against develop
git push origin feature/your-feature-name
```

Commit message conventions used in this project:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation update
- `test:` — test case additions
- `refactor:` — code restructuring

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ for college students who just want to eat on time.</p>
  <p><strong>CanteenGo</strong> — Order ahead. Skip the queue.</p>
</div>

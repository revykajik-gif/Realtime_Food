# Real-Time Rider Dispatch Platform

A full-stack food delivery project focused on order lifecycle management and real-time rider assignment.

## Why This Project Exists

This is not just a food ordering app. The main backend idea is dispatch: a restaurant accepts an order, the system searches available riders, calculates distance, sorts riders, and assigns the nearest one.

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, Context API, Socket.IO Client
- Backend: Node.js, Express, Prisma ORM, PostgreSQL, JWT, Socket.IO
- Infrastructure: Docker and Docker Compose

## Backend Flow

1. Routes receive HTTP requests.
2. Middleware handles authentication, roles, and validation.
3. Controllers keep request/response logic small.
4. Services contain business rules.
5. Prisma talks to PostgreSQL.
6. Socket.IO emits real-time order updates.

## Order Lifecycle

`PLACED -> ACCEPTED -> SEARCHING_RIDER -> RIDER_ASSIGNED -> OUT_FOR_DELIVERY -> DELIVERED`

Customers can cancel only while an order is still `PLACED`.

## DSA Component

Nearest rider assignment uses:

- array traversal to read available riders
- distance calculation with latitude/longitude
- sorting by distance
- greedy selection of the nearest rider

Time complexity: `O(n log n)` because riders are sorted by distance.

## Local Backend Setup

```bash
cd backend
copy .env.example .env
docker compose up -d postgres
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

Health check:

```bash
GET http://localhost:5000/health
```

Seed login password for all demo users:

```text
password123
```

## Main API Groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/restaurants`
- `POST /api/restaurants`
- `POST /api/food-items`
- `POST /api/orders`
- `PATCH /api/orders/:id/accept`
- `PATCH /api/orders/:id/out-for-delivery`
- `PATCH /api/orders/:id/deliver`
- `PATCH /api/orders/:id/cancel`
- `GET /api/admin/overview`

## Frontend Setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Interview Explanation

The project uses MVC plus a service layer. Controllers stay thin, services contain business decisions, Prisma models show relational database design, and Socket.IO is used only for real-time moments: new orders, rider assignments, and status updates.

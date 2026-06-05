# Skin Treatment Appointment System

Final Year Project (FYP) — MERN Stack web application for managing dermatology appointments, prescriptions, medical reports, e-commerce, and rider delivery.

**Authors:** Muhammad Salman (Frontend) · Mahrukh (Backend)
**Supervisor:** Sir Muhammad Kamran — Govt. Graduate College, Civil Lines, Sheikhupura
**Project ID:** 22-KS-BSIT-36

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui + Lucide React + Zustand + React Hook Form + Zod + Axios
- **Backend:** Node.js + Express.js + Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcrypt
- **Payments:** Stripe (test mode)
- **Email:** Nodemailer (Gmail SMTP)
- **File Uploads:** Multer → local `server/uploads/`

## Project Structure

```
FYP-Skin-Treatment-System/
├── client/      # React frontend (Salman)
├── server/      # Express backend (Mahrukh)
├── Documentations/
└── package.json # root scripts
```

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

This installs root + `client/` + `server/` dependencies.

### 2. Configure environment variables

- Copy `client/.env.example` → `client/.env`
- Copy `server/.env.example` → `server/.env`
- Fill in your MongoDB Atlas URI, JWT secret, Stripe test keys, Gmail SMTP app password

### 3. Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

## Roles

- **Admin** — full system control, analytics, manages doctors/patients/riders/products/orders
- **Doctor** — manages appointments, generates prescriptions, uploads reports
- **Patient** — books appointments, views prescriptions/reports, buys products, reviews doctors
- **Rider** — views assigned orders, updates delivery status

## Documentation

See [Documentations/PROJECT_PLAN.md](Documentations/PROJECT_PLAN.md) for the full execution plan and module roadmap.

# Skin Treatment Appointment System — Execution Plan

> **Status:** AWAITING APPROVAL — do not start coding until this plan is approved.
> **Prepared for:** Muhammad Salman (Frontend) & Mahrukh (Backend)
> **Supervisor:** Sir Muhammad Kamran — Govt. Graduate College, Civil Lines, Sheikhupura
> **Project ID:** 22-KS-BSIT-36

---

## 1. Tech Stack Decisions (Confirmed with Team)

| Layer            | Choice                                                                  | Rationale                                                                 |
|------------------|-------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Frontend         | **React 18 + Vite**                                                     | Fast HMR, modern, ideal for SPA FYP demo                                  |
| Styling          | **Tailwind CSS + shadcn/ui + Lucide React**                             | Professional medical look, full control, reusable components              |
| State / Forms    | **Zustand** for global state, **React Hook Form + Zod** for forms       | Lightweight, type-safe, less boilerplate than Redux                      |
| Routing          | **React Router DOM v6**                                                 | Standard SPA routing                                                     |
| HTTP             | **Axios** with interceptors                                             | Centralized auth header + error handling                                 |
| Charts (Admin)   | **Recharts**                                                            | Clean charts for analytics dashboard                                     |
| Backend          | **Node.js + Express.js (REST API)**                                     | Standard MERN backend                                                     |
| Database         | **MongoDB Atlas (cloud)**                                               | No local setup, shareable, free tier                                      |
| ODM              | **Mongoose**                                                            | Schema validation, relationships, hooks                                  |
| Auth             | **JWT (jsonwebtoken) + bcrypt**                                         | Stateless auth, encrypted passwords                                       |
| Validation       | **Joi** or **express-validator**                                        | Server-side input validation                                              |
| File Uploads     | **Multer + local `uploads/` folder**                                    | No external service needed for FYP demo                                   |
| Email            | **Nodemailer + Gmail SMTP (App Password)**                              | Appointment/order notifications, password reset                          |
| Payment          | **Stripe (test mode)**                                                  | Test card `4242 4242 4242 4242`, well-documented                         |
| Logging          | **Morgan** + custom error handler                                       | Request logs + structured errors                                          |
| Security         | **helmet, cors, express-rate-limit, xss-clean, hpp**                    | Baseline hardening                                                       |

> Note: `AI skin detection` and `live video chat` are explicitly **OUT OF SCOPE** per doc §1.6.

---

## 2. Project Structure (Monorepo)

```
FYP-Skin-Treatment-System/
├── client/                          # Salman — Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn primitives (button, input, card, dialog…)
│   │   │   ├── layout/              # Navbar, Sidebar, Footer, RoleLayout
│   │   │   └── shared/              # Loading, EmptyState, ConfirmDialog, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Register, ForgotPassword
│   │   │   ├── public/              # Home, About
│   │   │   ├── patient/             # Dashboard, Appointments, Prescriptions, Reports, Orders, Cart, Checkout
│   │   │   ├── doctor/              # Dashboard, Appointments, Prescriptions, Patients
│   │   │   ├── admin/               # Dashboard, Users, Doctors, Patients, Riders, Products, Orders, Analytics
│   │   │   └── rider/               # Dashboard, Deliveries
│   │   ├── services/                # api.js (Axios instance), authService, appointmentService…
│   │   ├── store/                   # Zustand stores (authStore, cartStore)
│   │   ├── hooks/                   # useAuth, useDebounce, useToast
│   │   ├── utils/                   # formatDate, formatCurrency, validators
│   │   ├── lib/                     # utils.js (cn helper for shadcn)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── server/                          # Mahrukh — Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # Mongo connection
│   │   │   ├── cloudinary.js        # (optional, future)
│   │   │   └── stripe.js
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Doctor.js
│   │   │   ├── Patient.js
│   │   │   ├── Appointment.js
│   │   │   ├── Prescription.js
│   │   │   ├── Report.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Rider.js
│   │   │   ├── Review.js
│   │   │   └── Notification.js
│   │   ├── controllers/             # Business logic
│   │   ├── routes/                  # Express routers
│   │   ├── middlewares/             # auth, roleGuard, errorHandler, upload
│   │   ├── validators/              # Joi schemas
│   │   ├── services/                # emailService, paymentService, notificationService
│   │   ├── utils/                   # ApiError, asyncHandler, token helpers
│   │   ├── app.js                   # Express app
│   │   └── server.js                # Entry point
│   ├── uploads/                     # Local file storage (gitignored)
│   ├── package.json
│   └── .env.example
│
├── Documentations/
│   ├── Documenation.md
│   └── PROJECT_PLAN.md              # this file
│
├── .gitignore
├── README.md
└── package.json                     # root scripts: "dev": concurrently
```

**Root-level convenience scripts (optional):**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "install-all": "npm install && npm install --prefix client && npm install --prefix server"
  }
}
```

---

## 3. Database Schema (All Collections)

> Naming: `camelCase` fields, `_id` default, `timestamps: true` on all collections.

### 3.1 `users` (base — referenced by role-specific collections)
| Field          | Type     | Notes                                |
|----------------|----------|--------------------------------------|
| `_id`          | ObjectId |                                      |
| `name`         | String   | required                             |
| `email`        | String   | required, unique, lowercase          |
| `password`     | String   | required, hashed (bcrypt, 12 rounds) |
| `role`         | Enum     | `admin` \| `doctor` \| `patient` \| `rider` |
| `phone`        | String   | optional                             |
| `avatar`       | String   | URL/path                             |
| `isActive`     | Boolean  | default `true`                       |
| `isEmailVerified` | Boolean | default `false`                     |
| `resetPasswordToken` | String | hashed, optional                  |
| `resetPasswordExpire` | Date |                                 |
| `createdAt`    | Date     |                                      |
| `updatedAt`    | Date     |                                      |

### 3.2 `doctors` (extends user data)
| Field            | Type     | Notes                                |
|------------------|----------|--------------------------------------|
| `userId`         | ObjectId | ref `User`, unique                   |
| `specialization` | String   | e.g. "Dermatologist"                 |
| `qualification`  | String   |                                      |
| `experience`     | Number   | years                                |
| `consultationFee`| Number   |                                      |
| `availability`   | Array    | of `{ day, slots:[{start,end,isBooked}] }` |
| `bio`            | String   |                                      |
| `rating`         | Number   | average, default 0                   |
| `totalReviews`   | Number   | default 0                            |

### 3.3 `patients` (extends user data)
| Field            | Type     | Notes                                |
|------------------|----------|--------------------------------------|
| `userId`         | ObjectId | ref `User`, unique                   |
| `dateOfBirth`    | Date     |                                      |
| `gender`         | Enum     | `male` \| `female` \| `other`        |
| `address`        | String   |                                      |
| `medicalHistory` | String   |                                      |
| `allergies`      | [String] |                                      |

### 3.4 `riders`
| Field       | Type     | Notes                                |
|-------------|----------|--------------------------------------|
| `userId`    | ObjectId | ref `User`, unique                   |
| `vehicleNo` | String   |                                      |
| `area`      | String   |                                      |
| `isAvailable` | Boolean | default `true`                     |

### 3.5 `appointments`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `patientId`   | ObjectId | ref `Patient`                        |
| `doctorId`    | ObjectId | ref `Doctor`                         |
| `date`        | Date     |                                      |
| `timeSlot`    | String   | "10:00-10:30"                        |
| `status`      | Enum     | `pending` \| `confirmed` \| `completed` \| `cancelled` |
| `reason`      | String   |                                      |
| `paymentId`   | ObjectId | ref `Payment`, optional              |
| `notes`       | String   | doctor-only                          |

### 3.6 `prescriptions`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `appointmentId` | ObjectId | ref `Appointment`, unique          |
| `doctorId`    | ObjectId | ref `Doctor`                         |
| `patientId`   | ObjectId | ref `Patient`                        |
| `medicines`   | Array    | of `{ name, dosage, duration, instructions }` |
| `advice`      | String   |                                      |
| `followUpDate`| Date     |                                      |
| `issuedAt`    | Date     | default `Date.now`                   |

### 3.7 `reports`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `patientId`   | ObjectId | ref `Patient`                        |
| `uploadedBy`  | ObjectId | ref `User` (doctor or admin)         |
| `title`       | String   |                                      |
| `description` | String   |                                      |
| `fileUrl`     | String   | `/uploads/reports/xyz.pdf`           |
| `fileType`    | String   | `pdf` \| `image`                     |
| `appointmentId` | ObjectId | optional                           |

### 3.8 `products`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `name`        | String   |                                      |
| `description` | String   |                                      |
| `category`    | String   | "Cleanser", "Sunscreen", etc.         |
| `price`       | Number   |                                      |
| `stock`       | Number   |                                      |
| `images`      | [String] | file paths                           |
| `brand`       | String   |                                      |
| `isActive`    | Boolean  |                                      |
| `rating`      | Number   |                                      |

### 3.9 `orders`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `patientId`   | ObjectId | ref `Patient`                        |
| `items`       | Array    | of `{ productId, name, price, quantity }` |
| `totalAmount` | Number   |                                      |
| `shippingAddress` | String |                                   |
| `status`      | Enum     | `pending` \| `paid` \| `shipped` \| `out-for-delivery` \| `delivered` \| `cancelled` |
| `riderId`     | ObjectId | ref `Rider`, optional                |
| `paymentId`   | ObjectId | ref `Payment`                        |
| `placedAt`    | Date     |                                      |

### 3.10 `payments`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `userId`      | ObjectId | ref `User`                           |
| `type`        | Enum     | `appointment` \| `order`             |
| `refId`       | ObjectId | polymorphic: appointment or order    |
| `amount`      | Number   |                                      |
| `method`      | String   | "stripe"                             |
| `stripePaymentIntentId` | String |                              |
| `status`      | Enum     | `pending` \| `succeeded` \| `failed` |
| `receiptUrl`  | String   | optional                             |

### 3.11 `reviews`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `patientId`   | ObjectId | ref `Patient`                        |
| `targetType`  | Enum     | `doctor` \| `product`                |
| `targetId`    | ObjectId |                                      |
| `rating`      | Number   | 1–5                                  |
| `comment`     | String   |                                      |
| `appointmentId` | ObjectId | optional                           |

### 3.12 `notifications`
| Field         | Type     | Notes                                |
|---------------|----------|--------------------------------------|
| `userId`      | ObjectId | recipient                            |
| `type`        | String   | "appointment", "order", "delivery"   |
| `title`       | String   |                                      |
| `message`     | String   |                                      |
| `isRead`      | Boolean  |                                      |
| `meta`        | Mixed    | optional extra data                  |

---

## 4. API Endpoints (Complete List)

> Base URL: `/api/v1` · Auth via `Authorization: Bearer <jwt>` · All responses follow `{ success, message, data }`.

### Auth (`/auth`)
- `POST /auth/register` — public, role-based registration (patient self-register; doctor/rider by admin)
- `POST /auth/login` — public, returns JWT
- `POST /auth/forgot-password` — public, sends email
- `POST /auth/reset-password/:token` — public
- `GET  /auth/me` — auth, get current user
- `POST /auth/logout` — auth (client clears token; server can also blacklist)
- `POST /auth/change-password` — auth

### Users (`/users`) — Admin
- `GET    /users` — admin (filter by role, search)
- `GET    /users/:id` — admin
- `PUT    /users/:id` — admin
- `DELETE /users/:id` — admin
- `PUT    /users/profile` — auth (self update)

### Doctors (`/doctors`)
- `GET    /doctors` — public (list with filters)
- `GET    /doctors/:id` — public
- `POST   /doctors` — admin
- `PUT    /doctors/:id` — admin
- `DELETE /doctors/:id` — admin
- `GET    /doctors/:id/availability` — auth

### Patients (`/patients`)
- `GET    /patients` — admin/doctor
- `GET    /patients/:id` — admin/doctor/self
- `PUT    /patients/:id` — admin/self
- `DELETE /patients/:id` — admin

### Riders (`/riders`)
- `GET    /riders` — admin
- `POST   /riders` — admin
- `PUT    /riders/:id` — admin
- `DELETE /riders/:id` — admin
- `GET    /riders/orders/assigned` — rider (self)

### Appointments (`/appointments`)
- `POST   /appointments` — patient (book)
- `GET    /appointments/me` — patient
- `GET    /appointments/doctor` — doctor
- `GET    /appointments` — admin (all)
- `GET    /appointments/:id` — auth (role-scoped)
- `PUT    /appointments/:id/status` — admin/doctor (confirm/cancel)
- `PUT    /appointments/:id/complete` — doctor
- `DELETE /appointments/:id` — admin

### Prescriptions (`/prescriptions`)
- `POST   /prescriptions` — doctor
- `GET    /prescriptions/me` — patient
- `GET    /prescriptions/doctor` — doctor
- `GET    /prescriptions/:id` — auth (role-scoped)
- `GET    /prescriptions/:id/pdf` — auth (downloadable PDF)

### Reports (`/reports`)
- `POST   /reports` — doctor/admin (multipart upload)
- `GET    /reports/me` — patient
- `GET    /reports/patient/:patientId` — doctor/admin
- `GET    /reports/:id/download` — auth
- `DELETE /reports/:id` — admin

### Products (`/products`)
- `GET    /products` — public (browse, filter, search, paginate)
- `GET    /products/:id` — public
- `POST   /products` — admin
- `PUT    /products/:id` — admin
- `DELETE /products/:id` — admin

### Cart & Orders (`/orders`)
- `POST   /orders` — patient (place order)
- `GET    /orders/me` — patient
- `GET    /orders` — admin (all)
- `GET    /orders/:id` — auth (role-scoped)
- `PUT    /orders/:id/status` — admin
- `PUT    /orders/:id/assign-rider` — admin
- `PUT    /orders/:id/delivery-status` — rider

### Payments (`/payments`)
- `POST   /payments/create-intent` — patient (Stripe payment intent)
- `POST   /payments/confirm` — patient (after Stripe success)
- `GET    /payments/me` — patient
- `GET    /payments` — admin

### Reviews (`/reviews`)
- `POST   /reviews` — patient
- `GET    /reviews/doctor/:doctorId` — public
- `GET    /reviews/product/:productId` — public
- `GET    /reviews/me` — patient

### Notifications (`/notifications`)
- `GET    /notifications/me` — auth
- `PUT    /notifications/:id/read` — auth
- `POST   /notifications` — admin (broadcast)

### Analytics (`/analytics`) — Admin only
- `GET    /analytics/overview` — totals (users, doctors, patients, revenue)
- `GET    /analytics/appointments` — chart data
- `GET    /analytics/orders` — chart data
- `GET    /analytics/revenue` — chart data

---

## 5. Module Build Order

> Each module = **1 Day 1 (Frontend with mock data) + 1 Day 2 (Backend) + Integration & Tests**. Modules must pass self-tests before next starts.

| # | Module                          | Foundation? | FRs covered    | Notes                                              |
|---|---------------------------------|-------------|----------------|----------------------------------------------------|
| 0 | **Project Setup & Tooling**     | ✅          | —              | Vite scaffold, Express scaffold, .env, scripts    |
| 1 | **Auth & User Management**      | ✅          | FR-1, FR-2, FR-15 | Blocks everything else                            |
| 2 | **Patient Profile**             |             | FR-3           | Self-update of profile                            |
| 3 | **Doctor Management (Admin)**   |             | FR-4           | CRUD on doctors                                   |
| 4 | **Appointment Booking**         |             | FR-5, FR-6     | Slots, conflict check, status flow                |
| 5 | **Prescriptions**               |             | FR-7           | PDF generation                                    |
| 6 | **Medical Reports**             |             | FR-8           | Upload, view, download                            |
| 7 | **Products (E-Commerce)**       |             | FR-9           | Admin CRUD + public listing                       |
| 8 | **Cart & Orders**               |             | FR-9, FR-11    | Place order, admin assigns rider                  |
| 9 | **Payments (Stripe)**           |             | FR-10          | Test mode, webhook optional                       |
| 10| **Rider Delivery Module**       |             | FR-11          | View + update delivery status                     |
| 11| **Email Notifications**         |             | FR-12          | Nodemailer templates                              |
| 12| **Ratings & Reviews**           |             | FR-13          | Doctor + product reviews                          |
| 13| **Admin Analytics Dashboard**   |             | FR-14          | Recharts                                          |
| 14| **Polish, Bug Fixes, Full E2E** |             | All            | Cross-module tests                                |

For each module, the plan will specify:
- Files created (frontend + backend)
- Endpoints exposed / components built
- Self-tests to run (see §6)
- Suggested Git commit message

---

## 6. Alternating Workflow (Day 1 / Day 2)

**Day 1 — Frontend (Salman):**
1. Build pages, components, forms (Zod + RHF)
2. Wire to **mock data** in `services/mock/*.js`
3. Match design system (Tailwind + shadcn, medical theme)
4. Responsive @ 375 / 768 / 1440
5. Test in browser: forms validate, routes navigate, loading/error/empty states render
6. Commit: `feat(frontend): <Module> — pages, components, forms`

**Day 2 — Backend (Mahrukh):**
1. Mongoose schema + model
2. Controller + router + Joi validation
3. Auth / roleGuard middleware
4. Centralized error handler
5. Manual API tests (Postman/Thunder Client or `curl`):
   - Correct status codes (200, 201, 400, 401, 403, 404, 500)
   - Validation rejects bad input
   - Auth blocks unauthorized/wrong-role
6. Commit: `feat(backend): <Module> — schema, controllers, routes`

**Day 2 / 3 — Integration:**
1. Replace mocks with real Axios calls
2. Wire forms to actual endpoints
3. Real loading / error handling
4. E2E: log in as each role, run every action, verify Mongo persistence
5. Commit: `feat(integration): <Module> — wired FE to BE`

**Self-test checklist (every module):**
- [ ] All endpoints return correct responses
- [ ] All forms submit successfully
- [ ] Validation rejects invalid input (both FE and BE)
- [ ] Role-based access enforced (try wrong role)
- [ ] Data persists correctly in MongoDB Atlas
- [ ] No browser console errors
- [ ] No Node.js terminal errors
- [ ] Module works end-to-end with a real session

---

## 7. Git Strategy

**Branch model:**
- `main` — stable, demo-ready
- `feature/frontend/<module>` — Salman
- `feature/backend/<module>` — Mahrukh
- Merged via PR (even between teammates for traceability)

**Commit author mapping:**
- `client/**` and docs → Salman (`salmansahib750@gmail.com`)
- `server/**` → Mahrukh (`mahrukhjutt884@gmail.com`)
- `Documentations/**` and root → either, co-authored

**Commit message format:**
```
<type>(<scope>): <module> — short description

type: feat | fix | chore | docs | test
scope: frontend | backend | integration | docs
```

**Suggested initial setup (after plan approval):**
```bash
git init
git checkout -b main
git add .
git commit -m "chore: project skeleton + plan"
git branch feature/backend/auth && git branch feature/frontend/auth
```

---

## 8. Design System

**Color palette (medical-friendly, FYP demo):**
- Primary: `#0F766E` (teal-700) — trust, calm, medical
- Primary hover: `#115E59` (teal-800)
- Secondary: `#0EA5E9` (sky-500) — action accent
- Background: `#FFFFFF` / `#F8FAFC` (slate-50)
- Surface: `#FFFFFF` with `border-slate-200`
- Text: `#0F172A` (slate-900) headings, `#475569` (slate-600) body
- Success: `#16A34A`, Warning: `#F59E0B`, Danger: `#DC2626`, Info: `#2563EB`

**Typography:** Inter (system fallback) — clean, medical.

**Spacing/grid:** 8-pt scale, generous whitespace, card-based layout.

**Reusable UI states every component must implement:**
- Loading (skeleton or spinner)
- Empty (icon + helpful message + CTA)
- Error (inline message, retry button)
- Success (toast or inline confirmation)

**Breakpoints:** `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1440`.

**Accessibility:** semantic HTML, `aria-label` on icon buttons, color contrast ≥ 4.5:1.

---

## 9. Environment Variables

**`client/.env`:**
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

**`server/.env`:**
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/skin-treatment
JWT_SECRET=<random-64-char>
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<gmail>
SMTP_PASS=<app-password>
SMTP_FROM="Skin Treatment <noreply@skintreatment.local>"
```

`.env` files are gitignored. Each teammate should fill their own.

---

## 10. Definition of Done (per module)

A module is **DONE** only when:
1. All FRs in its scope are implemented (FE + BE)
2. Self-test checklist passes
3. No `console.log` or debug code remains
4. Code is formatted (Prettier) and lints clean (ESLint)
5. Commit is pushed to the correct feature branch
6. A short README section in the module folder documents how to test it

---

## 11. Risks & Mitigations

| Risk                                                | Mitigation                                                  |
|-----------------------------------------------------|-------------------------------------------------------------|
| Stripe / SMTP credentials missing in dev            | Mock service fallback until real keys available              |
| MongoDB Atlas IP whitelist                         | Whitelist `0.0.0.0/0` for FYP demo, document in README      |
| File uploads balloon `git` size                    | `.gitignore` for `server/uploads/`                          |
| One author blocked                                  | Other can pick up; modules are loosely coupled             |
| Demo data needed for first run                      | `server/scripts/seed.js` adds 1 admin + 1 doctor + sample data |

---

## 12. Ready-to-Start Checklist (before Module 0)

Once you approve, I will:
1. Create `client/` (Vite React + Tailwind + shadcn init)
2. Create `server/` (Express + Mongoose skeleton)
3. Add root `package.json` with `concurrently` script
4. Add `.gitignore`, `README.md`, `.env.example` for both sides
5. Initialize git, set authors, push first commit
6. Then begin **Module 1 — Auth & User Management** (Day 1 Frontend)

---

## 13. Approval Required

Please review and confirm:

- [ ] Tech stack choices
- [ ] Project structure (monorepo, `client/` + `server/`)
- [ ] All 12 collections and API endpoints
- [ ] Module build order
- [ ] Git strategy (Salman = FE, Mahrukh = BE)
- [ ] Design system (teal/sky palette, Tailwind + shadcn)
- [ ] Self-test checklist

**Reply with "Approved" (or list changes) and I will start Module 0 → Module 1.**

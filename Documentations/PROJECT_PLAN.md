# Skin Treatment Appointment System — 10-Day Execution Plan

> **Revised plan** — full end-to-end project delivered in ~1.5 weeks.
> **Approach:** Parallel workstream — Salman (frontend) and Mahrukh (backend) work concurrently, integrated module-by-module at the end.
> **DB:** Local MongoDB (`mongodb://127.0.0.1:27017/skin-treatment`)

---

## Schedule Overview (10 working days)

| Day | Salman (Frontend)                              | Mahrukh (Backend)                          | Integration / E2E                  |
|-----|------------------------------------------------|--------------------------------------------|------------------------------------|
| 1   | All dashboard shells + nav + role-based layout | All 12 Mongoose models + auth/users + doctors + patients + riders | —                                  |
| 2   | All appointment UI + prescription UI + reports UI | Appointments + prescriptions + reports APIs (Multer upload)  | Wire appointments → backend        |
| 3   | Products + cart + checkout UI                  | Products + orders + cart APIs              | Wire products/orders → backend     |
| 4   | Payments UI (Stripe Elements) + rider UI       | Payments (Stripe) + rider APIs             | Wire payments → backend            |
| 5   | Notifications UI + reviews UI + analytics UI    | Notifications + reviews + analytics APIs    | Wire remaining                     |
| 6   | Polish UI — empty/loading/error states, responsive fixes | Email service (Nodemailer real) + seed script | Run all E2E flows                  |
| 7   | Bug fixes + admin user management UI           | Admin user-management APIs                 | E2E test all roles                 |
| 8   | Full system test (all 4 roles)                 | Full system test                           | Full system test                   |
| 9   | Demo data, deployment scripts, README polish   | Deployment scripts, environment docs       | Demo run-through                   |
| 10  | **Buffer / final polish / FYP defense prep**   | **Buffer / final polish**                  | **Buffer**                         |

> **Daily check-in:** After each day, pause for team lead approval before continuing.

---

## Today's Work (Day 1 of 10)

### Salman (Frontend) — Day 1
**Goal:** Lock in the design system + build all 4 dashboard shells so every other UI piece can drop into the right place.

**Files to create:**
- `client/src/components/layout/DashboardLayout.jsx` — sidebar + topbar shell, role-aware nav
- `client/src/components/layout/RoleSidebar.jsx` — different links per role
- `client/src/components/layout/Topbar.jsx` — user menu, logout, breadcrumbs
- `client/src/components/ui/avatar.jsx` — user avatar (shadcn-style)
- `client/src/components/ui/select.jsx` — dropdown
- `client/src/components/ui/textarea.jsx` — multiline input
- `client/src/components/ui/table.jsx` — for admin lists
- `client/src/components/ui/dialog.jsx` — modal
- `client/src/components/ui/badge.jsx` — status pills
- `client/src/pages/patient/Dashboard.jsx` — patient home (cards: upcoming appt, recent prescriptions, recent orders, etc.)
- `client/src/pages/doctor/Dashboard.jsx` — doctor home (today's appointments, recent patients, quick actions)
- `client/src/pages/admin/Dashboard.jsx` — admin home (KPIs, charts placeholders, quick links)
- `client/src/pages/rider/Dashboard.jsx` — rider home (assigned orders, delivery status)
- `client/src/services/mock/*.js` — mock data for each module
- Update `client/src/App.jsx` — wire dashboards into role routes
- Update `client/src/store/authStore.js` if needed
- Create `client/src/store/cartStore.js` — Zustand store for cart (used in Module 8)

**Self-tests:**
- [ ] Each role dashboard renders at `/admin`, `/doctor`, `/patient`, `/rider`
- [ ] Sidebar shows correct links per role
- [ ] Topbar shows current user, logout works
- [ ] Responsive at 375/768/1440 px
- [ ] No console errors

### Mahrukh (Backend) — Day 1
**Goal:** All 12 Mongoose models + auth + user/doctor/patient/rider CRUD APIs.

**Files to create:**
- `server/src/models/Doctor.js`
- `server/src/models/Patient.js`
- `server/src/models/Rider.js`
- `server/src/models/Appointment.js`
- `server/src/models/Prescription.js`
- `server/src/models/Report.js`
- `server/src/models/Product.js`
- `server/src/models/Order.js`
- `server/src/models/Payment.js`
- `server/src/models/Review.js`
- `server/src/models/Notification.js`
- `server/src/controllers/user.controller.js` — admin user CRUD + self-profile
- `server/src/controllers/doctor.controller.js` — public list + admin CRUD
- `server/src/controllers/patient.controller.js` — admin list + self CRUD
- `server/src/controllers/rider.controller.js` — admin CRUD
- `server/src/routes/user.routes.js`
- `server/src/routes/doctor.routes.js`
- `server/src/routes/patient.routes.js`
- `server/src/routes/rider.routes.js`
- `server/src/validators/user.validators.js`, `doctor.validators.js`, `patient.validators.js`, `rider.validators.js`
- Update `server/src/app.js` — mount the 4 new routers
- Update `server/.env` — set `MONGO_URI=mongodb://127.0.0.1:27017/skin-treatment`
- Update `server/src/scripts/seed.js` — seed admin + sample doctor + sample patient + sample rider

**Self-tests (Postman/Thunder Client):**
- [ ] `mongod` running locally; `npm run seed` creates admin + 3 sample accounts
- [ ] `POST /auth/login` with seeded admin → 200 + token
- [ ] `POST /auth/register` patient → 201
- [ ] `GET /users` (with admin token) → 200, returns list
- [ ] `POST /doctors` (admin) → 201, doctor record created
- [ ] `GET /doctors` (public) → 200, list
- [ ] `POST /patients` (admin) → 201
- [ ] `POST /riders` (admin) → 201
- [ ] `GET /users/:id` wrong role → 403
- [ ] `GET /auth/me` no token → 401

---

## Tech Stack (Confirmed)

| Layer         | Choice                                                              |
|---------------|---------------------------------------------------------------------|
| Frontend      | React 18 + Vite + Tailwind + shadcn-style UI + Lucide               |
| State/Forms   | Zustand + React Hook Form + Zod                                     |
| Backend       | Node.js + Express + Mongoose                                        |
| Database      | **Local MongoDB** (`mongodb://127.0.0.1:27017/skin-treatment`)     |
| Auth          | JWT + bcrypt                                                        |
| Files         | Multer → local `server/uploads/`                                    |
| Email         | Nodemailer (Gmail SMTP) — wired on Day 6                            |
| Payment       | Stripe test mode                                                    |

## Folder Structure

```
FYP-Skin-Treatment-System/
├── client/      # Salman — frontend
├── server/      # Mahrukh — backend
├── Documentations/
└── package.json
```

## Git Strategy

- **Salman** = frontend commits (`client/**`)
- **Mahrukh** = backend commits (`server/**`)
- Branches: `main` + `feature/frontend/<x>` + `feature/backend/<x>`
- Commit format: `feat(frontend): ...` / `feat(backend): ...` / `feat(integration): ...`

---

## Definition of Done (per module)

A module is done when:
- [ ] Backend endpoints return correct status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Frontend forms submit successfully with real API
- [ ] Validation works (rejects bad input on both sides)
- [ ] Role-based access works (try wrong role)
- [ ] Data persists in MongoDB
- [ ] No browser console errors
- [ ] No Node.js terminal errors
- [ ] Module works end-to-end for at least one role

## Definition of Done (whole project)

- [ ] Every FR-1 through FR-15 implemented
- [ ] All 4 roles (admin, doctor, patient, rider) can log in and use their dashboards
- [ ] E2E happy path: register → login → book appointment → pay → doctor generates prescription → patient views → patient orders product → pays → admin assigns rider → rider delivers → patient reviews
- [ ] Admin analytics dashboard shows real data
- [ ] Responsive + no console errors
- [ ] README has full setup + run instructions
- [ ] Seed script creates demo data for defense demo

---

## Status

- **Module 0 (project foundation):** ✅ DONE
- **Module 1 Day 1 (FE auth pages):** ✅ DONE
- **Module 1 Day 2 (BE auth API):** ✅ DONE
- **Module 1 Integration:** ✅ DONE (env toggle controls mock vs real)
- **Day 1 of parallel work:** 🔄 STARTING NOW

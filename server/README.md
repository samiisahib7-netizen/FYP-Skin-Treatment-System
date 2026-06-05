# Server (Backend)

Node.js + Express + Mongoose. **Authored by: Mahrukh.**

## Quick start

```bash
cp .env.example .env       # then fill MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed               # creates default admin (admin@skintreatment.local / Admin@12345)
npm run dev                # http://localhost:5000
```

## Endpoints (Module 1)

| Method | Path                            | Auth         | Description                          |
|--------|---------------------------------|--------------|--------------------------------------|
| GET    | `/api/v1/health`                | public       | Liveness check                       |
| POST   | `/api/v1/auth/register`         | public       | Patient self-registration            |
| POST   | `/api/v1/auth/login`            | public       | Email + password → JWT               |
| POST   | `/api/v1/auth/forgot-password`  | public       | Send reset link (always 200)         |
| POST   | `/api/v1/auth/reset-password/:token` | public   | Set new password from email token    |
| GET    | `/api/v1/auth/me`               | bearer       | Current user                          |
| POST   | `/api/v1/auth/change-password`  | bearer       | Change own password                   |
| POST   | `/api/v1/auth/logout`           | bearer       | Stateless logout (client clears JWT)  |

## Folder layout

```
src/
├── config/        # db.js
├── controllers/   # business logic
├── middlewares/   # auth, roleGuard, validate, errorHandler
├── models/        # Mongoose schemas
├── routes/        # Express routers
├── scripts/       # seed.js
├── services/      # emailService (stub for Module 1; Nodemailer in Module 11)
├── utils/         # ApiError, asyncHandler, jwt
├── validators/    # Joi schemas
├── app.js
└── server.js
```

<div align="center">

# 🔧 Fixly

**A full-stack home-services marketplace.** Customers search, book and review
verified local professionals. Providers manage their business. Admins police the
platform. Three roles, one codebase.

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=flat)](https://fixly-bice-psi.vercel.app)
[![API](https://img.shields.io/badge/API-Health-2ea44f?style=flat)](https://fixly-rx59.onrender.com/health)

![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B4D6?style=flat&logo=tailwindcss&logoColor=white)
![Node 20+](https://img.shields.io/badge/Node_20+-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Rotation-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)

🚀 **Deployed:** Frontend on [Vercel](https://fixly-bice-psi.vercel.app) ·
Backend on [Render](https://fixly-rx59.onrender.com/health)

</div>

---

## ✨ Features

| Role | Capabilities |
| ---- | ------------ |
| 🙋 **Customer** | Geo-search by distance, price, rating, availability · book slots · track status · save favourites · review completed jobs · manage profile & address |
| 🧰 **Provider** | Onboarding + approval flow · publish services from a curated catalogue · accept / complete / reject requests · earnings & ratings dashboard |
| 🛡️ **Admin** | Approve / reject / block providers & customers · curate categories & catalogue · platform-wide booking oversight · 7-day activity metrics |

**47 REST endpoints · 6 collections · 3 role-based access tiers.**

## 🔑 Demo credentials

The deployed database ships pre-seeded with demo data. All `@fixly.dev`
accounts use the password `Demo@1234` unless noted.

| Role | Email | Password |
| ---- | ----- | -------- |
| 🛡️ **Admin** | `demo.admin@fixly.dev` | `Fixly@123` |
| 🙋 **Customer** | `aashi@fixly.dev` · `rushi@fixly.dev` · `annu@fixly.dev` | `Demo@1234` |
| 🧰 **Provider** | `cleanpro@fixly.dev` · `coolair@fixly.dev` · `brightspark@fixly.dev` · `stylehub@fixly.dev` *(pending approval)* | `Demo@1234` |

## 🛠️ Tech stack

| Layer | Choices |
| ----- | ------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router v7, React Hook Form, Recharts, Sonner |
| **Backend** | Node 20+, Express 5 (ESM), Mongoose 9, Zod |
| **Auth** | Split JWT (access + rotating refresh), bcrypt, Google OAuth (code-complete, disabled) |
| **Security** | helmet, 4-tier rate limiting, CORS + httpOnly cookies, input validation on every mutating route, soft delete with PII anonymisation |
| **Services** | MongoDB Atlas (`2dsphere` geo index), Cloudinary + Multer, Nodemailer (SMTP) |

**Request lifecycle** on every mutating route:
`rate limit → authenticate → authorise → validate → execute → normalise errors`.

Ratings & booking counts are **derived on read** (never stored), so counters
can never go stale.

## 🚀 Quick start

Prerequisites: Node 20+, a MongoDB URI, Cloudinary keys, SMTP credentials.

```bash
# 1. Backend (http://localhost:1337)
cd backend
npm install
cp .env.example .env    # fill in values
npm run dev

# 2. Frontend (http://localhost:5173)
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:1337
npm run dev
```

Generate JWT secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 📁 Structure

```
Fixly/
├── backend/            # Express 5 API — routes, controllers, models, middleware, validation
└── frontend/           # React SPA — pages, components, contexts, hooks, api modules
```

- **`backend/.env.example`** — every environment variable documented
- **`frontend/vercel.json`** — SPA rewrite so deep links never 404

## ⚠️ Known limits

Honest list of what is intentionally not shipped yet:

- **Payments** — pay-after-service by design; no gateway integration
- **Google OAuth** — code-complete but disabled until a client ID is added
- **Email** — sends via Gmail SMTP; production domain (SPF/DKIM) not configured
- **Tests / CI** — no automated suite or pipeline yet
- **Hardening** — no per-account brute-force lockout, one session per account

---

<div align="center">

Built by **Rushikesh** — Fixly, a full-stack home-services marketplace.

</div>
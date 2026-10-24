# AI Commerce Platform

A production-oriented, full-stack AI-powered e-commerce platform built with the **MERN stack** (MongoDB, Express, React, Node.js), featuring Gemini AI integration, a complete admin panel foundation, premium animations, and mobile-first responsive design.

---

## 🚀 Features Implemented (Phase 1 Foundation)

### Backend
- ✅ Express.js server with security middleware (Helmet, CORS, rate limiting)
- ✅ MongoDB Atlas connection with Mongoose
- ✅ Complete User model (auth, addresses, wishlist, roles, lockout protection)
- ✅ Product, Category, Collection, Order, Cart, Review, Coupon models
- ✅ SupportTicket, Notification, Settings, AuditLog models
- ✅ JWT authentication (register, login, logout, password reset, email verification)
- ✅ Role-based authorization middleware (`customer`, `admin`, `moderator`)
- ✅ Product CRUD API (public + admin routes)
- ✅ Search, filter, sort, pagination for products
- ✅ Safe seed script (does not delete existing data)
- ✅ Cloudinary configuration ready
- ✅ Centralized error handling & input validation

### Frontend
- ✅ React + Vite with modern tooling
- ✅ React Router navigation
- ✅ Auth Context (login, register, logout, protected state)
- ✅ Cart Context (guest cart with localStorage persistence)
- ✅ Theme Context (light/dark mode)
- ✅ Premium design system with CSS custom properties
- ✅ Animated homepage (GSAP + Framer Motion)
- ✅ Shop page with filters, sorting, pagination, product grid
- ✅ Product detail page with image gallery & related products
- ✅ Shopping cart page
- ✅ Login & Register pages with password visibility toggle
- ✅ Responsive header with mobile drawer & search overlay
- ✅ Footer, 404 page
- ✅ Toast notifications

---

## 📋 Remaining Work (Future Phases)

The following features are architected and ready to be expanded:

| Phase | Feature | Status |
|-------|---------|--------|
| 2 | Category & Collection APIs + frontend pages | Models ready |
| 2 | Cart & Wishlist backend persistence | Models ready |
| 2 | Checkout flow & Order creation | Models ready |
| 3 | Full Admin Dashboard (analytics, CRUD tables) | Routes scaffolded |
| 3 | Customer Account Dashboard | Structure ready |
| 4 | Gemini AI Shopping Assistant | SDK in dependencies |
| 4 | Admin AI Assistant | Planned |
| 5 | Reviews system | Model ready |
| 5 | Coupons & Discounts | Model ready |
| 5 | Support tickets | Model ready |
| 6 | Cloudinary image upload endpoints | Config ready |
| 6 | Email service (verification, reset) | Nodemailer ready |
| 7 | Automated tests (Jest + Supertest) | Script ready |
| 7 | PWA support | Planned |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Axios, Zustand-ready, Framer Motion, GSAP, Lucide Icons |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| AI | Google Gemini (`@google/genai`) |
| Images | Cloudinary |
| Validation | express-validator / Zod-ready |

---

## 📦 Project Structure

```
ai-commerce-platform/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── styles/
│   │   └── ...
│   └── package.json
├── backend/           # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── seed.js
│   └── package.json
├── package.json       # Root scripts
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier works)
- (Optional) Cloudinary account
- (Optional) Google AI Studio API key for Gemini

### 1. Clone & Install

```bash
cd ai-commerce-platform

# Install root + both packages
npm install
npm run install:all
```

Or separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Network Access → Add IP Address → Allow from Anywhere (`0.0.0.0/0`) for development
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<password>` with your password and add a database name, e.g.:

```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ai-commerce?retryWrites=true&w=majority
```

### 3. Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=generate_a_long_random_string_here_min_32_chars
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
ADMIN_EMAIL=admin@aicommerce.com
ADMIN_PASSWORD=Admin@123456
```

### 4. Frontend Environment

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Admin user (credentials printed to console)
- Sample categories, collections, products
- Sample coupons
- Default settings

**Safe seed**: It never deletes existing data.

### 6. Start Development Servers

**Terminal 1 – Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm run dev
```

Or from root (if `concurrently` is installed):
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

### 7. Default Admin Login

```
Email:    admin@aicommerce.com
Password: Admin@123456
```

⚠️ **Change the admin password immediately after first login.**

---

## 🧪 Manual Testing Checklist

- [ ] Register a new customer account
- [ ] Login / Logout
- [ ] Browse products on Shop page
- [ ] Search products
- [ ] Filter by price / featured
- [ ] View product detail
- [ ] Add to cart / update quantity / remove
- [ ] Guest cart persists after refresh
- [ ] Dark / Light theme toggle
- [ ] Mobile responsive navigation
- [ ] Admin login works
- [ ] Seed data appears correctly

---

## 🚢 Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
NODE_ENV=production node server.js
```

### Deployment Notes

**Frontend (Vercel / Netlify):**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-api-domain.com/api`

**Backend (Railway / Render / DigitalOcean / AWS):**
- Set all environment variables from `.env.example`
- Ensure `CLIENT_URL` matches your frontend domain for CORS
- MongoDB Atlas Network Access must allow the server IP (or `0.0.0.0/0`)

**Important:**
- Never commit `.env` files
- Use strong `JWT_SECRET` in production
- Enable HTTPS
- Restrict CORS origins in production

---

## 🤖 Gemini AI Integration (Next Phase)

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Set `GEMINI_API_KEY` in backend `.env`
3. The AI chat endpoint will:
   - Search real MongoDB product data
   - Never invent prices or stock
   - Rate-limit requests
   - Provide product links and recommendations

---

## 📄 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Private | Logout |
| GET | `/api/auth/me` | Private | Current user |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:slug` | Public | Product detail |
| GET | `/api/products/search` | Public | Autocomplete search |
| GET | `/api/admin/products` | Admin | Admin product list |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |

---

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT with configurable expiry
- Account lockout after 5 failed login attempts
- Rate limiting on auth and general routes
- Helmet security headers
- Input validation with express-validator
- Role-based access control (server-side)
- HTTP-only cookies option
- No secrets in frontend code

---

## 📱 Responsive Design

Tested breakpoints:
- Mobile: 320px – 639px
- Tablet: 640px – 1023px
- Desktop: 1024px+

Features:
- Touch-friendly buttons (min 44px)
- Mobile navigation drawer
- Responsive product grids
- Safe-area support
- Reduced-motion accessibility

---

## 📄 License

MIT

---

**Built as a production-oriented foundation.** Extend the remaining phases (cart backend, checkout, admin dashboard, AI assistant) on top of this solid architecture.

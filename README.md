# Tutoria Salon — Full MERN Stack Application

A complete salon appointment booking system with user-facing website, booking flow,
account management, and a private admin dashboard.

---

## Project Structure

```
tutoria/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── stylistController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect + isAdmin
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   └── Stylist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── stylistRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js       # Nodemailer email sender
│   │   └── seedData.js        # DB seeder script
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React (Vite) application
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── AboutPage.jsx
    │   │   ├── ServicesPage.jsx
    │   │   ├── StylistsPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   ├── ContactPage.jsx
    │   │   ├── BookPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── AccountPage.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useApi.js
    │   ├── utils/
    │   │   ├── api.js          # Axios instance + all API calls
    │   │   ├── constants.js    # Services, colors
    │   │   └── helpers.js      # Date/slot helpers
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, email credentials
npm run seed        # Seeds stylists and admin user
npm run dev         # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:5173
```

---

## Default Credentials

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@tutoria.in    | admin123   |
| User  | Register via UI     | your choice|

---

## Environment Variables (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tutoria
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints

### Auth
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/register    | Public  | Register new user    |
| POST   | /api/auth/login       | Public  | Login, get JWT token |
| GET    | /api/auth/me          | Private | Get current user     |

### Bookings
| Method | Endpoint                    | Access  | Description             |
|--------|-----------------------------|---------|-------------------------|
| POST   | /api/bookings               | Private | Create booking           |
| GET    | /api/bookings/my            | Private | Get user's bookings      |
| PUT    | /api/bookings/:id/cancel    | Private | Cancel booking           |
| GET    | /api/bookings/slots         | Public  | Get available time slots |

### Stylists
| Method | Endpoint         | Access | Description        |
|--------|------------------|--------|--------------------|
| GET    | /api/stylists    | Public | List all stylists  |

### Admin
| Method | Endpoint                        | Admin  | Description               |
|--------|---------------------------------|--------|---------------------------|
| GET    | /api/admin/bookings             | Admin  | All bookings + filters    |
| PUT    | /api/admin/bookings/:id         | Admin  | Edit any booking          |
| DELETE | /api/admin/bookings/:id/cancel  | Admin  | Cancel any booking        |
| POST   | /api/admin/notify               | Admin  | Send email/WhatsApp notif |
| GET    | /api/admin/stats                | Admin  | Dashboard stats           |

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Nodemailer  
**Frontend:** React 18, Vite, Axios, React Router DOM  
**Styling:** Custom CSS-in-JS with Google Fonts (Cormorant Garamond + DM Sans)

# Tutoria Salon — Deployment Guide
## Stack: Vercel (Frontend) + Render (Backend) + MongoDB Atlas

---

## 1. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com → Create a free cluster
2. **Database Access** → Add User → set username & password
3. **Network Access** → Add IP Address → `0.0.0.0/0` (Allow from anywhere — needed for Render)
4. **Connect** → Drivers → Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.XXXXX.mongodb.net/tutoria?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials

---

## 2. Deploy Backend to Render

1. Push the `backend/` folder to a GitHub repository
2. Go to https://render.com → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. **Environment Variables** (under Environment tab):
   ```
   MONGO_URI        = mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/tutoria?retryWrites=true&w=majority
   JWT_SECRET       = [generate a long random string - use: openssl rand -hex 32]
   JWT_EXPIRE       = 30d
   EMAIL_HOST       = smtp.gmail.com
   EMAIL_PORT       = 587
   EMAIL_USER       = your_email@gmail.com
   EMAIL_PASS       = your_gmail_app_password
   FRONTEND_URL     = https://your-app.vercel.app   ← update after Vercel deploy
   NODE_ENV         = production
   PORT             = 10000
   ```

6. Deploy → Note the URL: `https://tutoria-backend.onrender.com`

### Seed the database (run once after backend is live):
```bash
cd backend
MONGO_URI="your_atlas_uri" node utils/seedData.js
```

---

## 3. Deploy Frontend to Vercel

1. Push the `frontend/` folder to a GitHub repository
2. Go to https://vercel.com → New Project → Import repo
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://tutoria-backend.onrender.com
   ```
   ⚠️ No trailing slash. This must match your Render URL exactly.

5. Deploy → Note the URL: `https://your-app.vercel.app`

6. **Go back to Render** and update `FRONTEND_URL` to your Vercel URL, then redeploy.

---

## 4. Image Handling

All stylist photos use **Unsplash URLs** (already CDN-hosted). No local file storage needed.

To use your own photos:
- Upload to **Cloudinary** (free): https://cloudinary.com
- Copy the image URL and use it in the `photo` field when creating/editing a stylist via the admin dashboard

---

## 5. Gmail App Password (for email features)

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Use the 16-character code as `EMAIL_PASS`

---

## 6. Verify Everything Works

- `https://your-backend.onrender.com/api/health` → should return `{ "status": "OK" }`
- `https://your-frontend.vercel.app` → should load the app
- Login with admin credentials seeded by `seedData.js`

---

## ⚠️ Important Notes

- **Render Free tier sleeps** after 15 min of inactivity. First request after sleep takes ~30s.
  - Upgrade to Render Starter ($7/mo) to avoid this, or use a cron job to ping `/api/health`
- **Never commit `.env`** — it's in `.gitignore`
- **MONGO_URI** must never be `localhost` in production

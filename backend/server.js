const express  = require("express");
const cors     = require("cors");
const morgan   = require("morgan");
const dotenv   = require("dotenv");
const path     = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { verifyEmailConfig } = require("./utils/sendEmail");
const dns = require('dns')

dns.setServers([
    '1.1.1.1','8.8.8.8'
])
// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

//  CORS 
// Allow the configured frontend URL + localhost for dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://tutoria-salon-k8dv.vercel.app",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

//  Routes 
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/stylists", require("./routes/stylistRoutes"));
app.use("/api/admin",    require("./routes/adminRoutes"));
app.use("/api/contact",  require("./routes/contactRoutes"));

// Health check — used by Render to verify the service is alive
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Tutoria API is running",
    env: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

//  Error Middleware 
app.use(notFound);
app.use(errorHandler);

//  Start 
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\nTutoria API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  await verifyEmailConfig();
});

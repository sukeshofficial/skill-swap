import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import "./auth/passport.js";

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL ? new URL(process.env.FRONTEND_URL).origin : 'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // dev fallback
      }
    },
    credentials: true,
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_development_only_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Pre-fix with /api so it successfully catches the Vite Dev Server proxy rules
app.use('/api/v1/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

export default app;

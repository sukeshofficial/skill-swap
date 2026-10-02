import express from "express";
import passport from "passport";
import AuthController from "../controllers/authControllers.js";

const router = express.Router();
const authController = new AuthController();

// ─── Email / Password Auth ───────────────────────────────────────────────────
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// ─── Google OAuth ────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  authController.googleCallback);

// ─── Session Utils ───────────────────────────────────────────────────────────
router.get('/logout', authController.logout);
router.get('/status', authController.checkStatus);

export default router;

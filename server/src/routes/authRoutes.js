import express from "express";
import passport from "passport";
import AuthController from "../controllers/authControllers.js"


const router = express.Router();
const authController = new AuthController();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google',
    {
      failureRedirect: '/login',
      session: true
    }),
  authController.googleCallback);

router.get('/logout', authController.logout);
router.get('/status', authController.checkStatus);


export default router;

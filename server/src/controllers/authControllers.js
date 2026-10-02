import User from '../models/User.js';
import { generateOTP, sendOTPEmail } from '../services/emailService.js';

class AuthController {

  // ─── 1. Email / Password Signup ────────────────────────────────────────────
  signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }

      // Check if email is already taken by a verified user
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && existing.isVerified) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      let user;
      if (existing && !existing.isVerified) {
        // Resend OTP to unverified account – update fields
        existing.name = name;
        existing.password = password; // will be re-hashed by pre-save hook
        existing.otp = otp;
        existing.otpExpiry = otpExpiry;
        user = await existing.save();
      } else {
        user = await User.create({ name, email, password, otp, otpExpiry });
      }

      await sendOTPEmail(email, name, otp);

      // Return the userId so frontend can pass it to /verify-otp
      return res.status(201).json({
        message: 'Account created! Please check your email for the 6-digit OTP.',
        userId: user._id,
        email: user.email,
      });
    } catch (err) {
      console.error('Signup error:', err);
      return res.status(500).json({ message: 'Server error during signup.' });
    }
  };

  // ─── 2. OTP Verification ────────────────────────────────────────────────────
  verifyOtp = async (req, res) => {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        return res.status(400).json({ message: 'userId and otp are required.' });
      }

      // Fetch user with OTP fields (normally excluded by select:false)
      const user = await User.findById(userId).select('+otp +otpExpiry');
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Account is already verified.' });
      }

      if (!user.otp || user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
      }

      if (!user.otpExpiry || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
      }

      // Mark verified and clear OTP
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      // Establish a session (same as Google OAuth flow)
      req.login(user, (err) => {
        if (err) {
          console.error('Session login error after OTP verify:', err);
          // Still return success — user can login manually
          return res.status(200).json({ message: 'Email verified! Please sign in.', verified: true });
        }
        return res.status(200).json({
          message: 'Email verified successfully!',
          verified: true,
          user: { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture },
        });
      });
    } catch (err) {
      console.error('OTP verify error:', err);
      return res.status(500).json({ message: 'Server error during OTP verification.' });
    }
  };

  // ─── 3. Resend OTP ──────────────────────────────────────────────────────────
  resendOtp = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required.' });
      }

      const user = await User.findById(userId).select('+otpExpiry');
      if (!user) return res.status(404).json({ message: 'User not found.' });
      if (user.isVerified) return res.status(400).json({ message: 'Account is already verified.' });

      // Rate-limit: prevent spam (30-second cooldown)
      if (user.otpExpiry && user.otpExpiry > new Date(Date.now() + 9.5 * 60 * 1000)) {
        return res.status(429).json({ message: 'Please wait 30 seconds before requesting a new code.' });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendOTPEmail(user.email, user.name, otp);

      return res.status(200).json({ message: 'New OTP sent! Check your inbox.' });
    } catch (err) {
      console.error('Resend OTP error:', err);
      return res.status(500).json({ message: 'Server error while resending OTP.' });
    }
  };

  // ─── 4. Email / Password Login ──────────────────────────────────────────────
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      // Fetch user with password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password +otp +otpExpiry');
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // If the user signed up but never verified OTP
      if (!user.isVerified) {
        return res.status(403).json({
          message: 'Please verify your email before logging in.',
          requiresVerification: true,
          userId: user._id,
          email: user.email,
        });
      }

      // Establish session
      req.login(user, (err) => {
        if (err) {
          console.error('Session error on login:', err);
          return res.status(500).json({ message: 'Failed to create session.' });
        }
        return res.status(200).json({
          message: 'Login successful!',
          user: { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture },
        });
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error during login.' });
    }
  };

  // ─── 5. Forgot Password – Request OTP ───────────────────────────────────────
  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Return 200 for security so attackers can't enumerate emails
        return res.status(200).json({
          message: 'If an account with that email exists, an OTP code has been sent.',
          dummy: true,
        });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendOTPEmail(user.email, user.name, otp);

      return res.status(200).json({
        message: 'OTP verification code sent to your email address.',
        userId: user._id,
        email: user.email,
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      return res.status(500).json({ message: 'Server error requesting password reset.' });
    }
  };

  // ─── 6. Reset Password with OTP ─────────────────────────────────────────────
  resetPassword = async (req, res) => {
    try {
      const { userId, otp, newPassword } = req.body;
      if (!userId || !otp || !newPassword) {
        return res.status(400).json({ message: 'userId, OTP, and new password are required.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }

      const user = await User.findById(userId).select('+otp +otpExpiry');
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (!user.otp || user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP code.' });
      }

      if (!user.otpExpiry || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
      }

      // Update password and clear OTP
      user.password = newPassword;
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      // Log user in automatically
      req.login(user, (err) => {
        if (err) {
          return res.status(200).json({ message: 'Password reset successfully! Please log in.', reset: true });
        }
        return res.status(200).json({
          message: 'Password reset successfully! Logged in.',
          reset: true,
          user: { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture },
        });
      });
    } catch (err) {
      console.error('Reset password error:', err);
      return res.status(500).json({ message: 'Server error resetting password.' });
    }
  };

  // ─── 5. Google OAuth Callback ───────────────────────────────────────────────
  googleCallback = (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/dashboard');
  };

  // ─── 6. Logout ──────────────────────────────────────────────────────────────
  logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  };

  // ─── 7. Auth Status Check ───────────────────────────────────────────────────
  checkStatus = (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.status(200).json({
        isAuthenticated: true,
        user: req.user
      });
    }
    res.status(401).json({
      isAuthenticated: false,
      message: 'User is not authenticated'
    });
  };
}

export default AuthController;

class AuthController {
  // 1. Handles the successful Google Sign-In redirect loop
  googleCallback = (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/dashboard');
  };

  // 2. Destroys the Passport session cookie
  logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: 'Logout failed' });

      // Clear the session cookie explicitly from the client browser
      res.clearCookie('connect.sid'); 
      res.status(200).json({ message: 'Logged out successfully' });
    });
  };

  // 3. NEW: Responds to apiClient.js (authApi.checkAuthStatus)
  checkStatus = (req, res) => {
    // If passport.session() finds a valid cookie, it populates req.user automatically
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.status(200).json({
        isAuthenticated: true,
        user: req.user // Sends user data profile back to your React app
      });
    }

    // If no active session exists
    res.status(401).json({
      isAuthenticated: false,
      message: 'User is not authenticated'
    });
  };
}

export default AuthController;

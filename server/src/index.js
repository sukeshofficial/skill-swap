import dotenv from "dotenv/config";

import connectDB from './config/db.js';
import app from './app.js'; 

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish Database Connection safely
    await connectDB();
    console.log('Connected to MongoDB successfully 🚀');

    // 2. Start checking for inbound network traffic
    app.listen(PORT, () => {
      console.log(`Server executing in development mode on port: http://localhost:${PORT} ⚡`);
    });
  } catch (err) {
    console.error('Database connection failed initialization ❌:', err);
    process.exit(1);
  }
};

startServer();

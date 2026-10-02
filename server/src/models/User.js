import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  age: {
    type: Number,
    default: 18,
  },
  profilePicture: {
    type: String,
    default: 'https://placehold.net/avatar.png' // Optional fallback placeholder
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
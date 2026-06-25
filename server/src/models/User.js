import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'operator'], 
    default: 'operator' // Default role as requested
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
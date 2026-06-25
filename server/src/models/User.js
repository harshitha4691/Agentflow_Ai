import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email field is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password field is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents password from being leaked in standard queries
    },
    role: {
      type: String,
      enum: ['admin', 'operator'],
      default: 'operator',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt values
  }
);

// Pre-save hook: Automatically hash password using bcrypt before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to check if an entered password matches the stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
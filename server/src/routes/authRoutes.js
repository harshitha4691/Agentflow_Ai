import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_JWT_KEY_SIGNATURE_9988';

// ==========================================
// 🛡️ AUTH MIDDLEWARE (Protecting Routes)
// ==========================================
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired.' });
  }
};

// ==========================================
// 📝 1. USER REGISTRATION (Bcrypt Cost 12)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists.' });
    }

    // ⚡ CRITICAL SPEC: Password hashing with bcrypt at cost 12
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'operator'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ==========================================
// 🔑 2. USER LOGIN & JWT ISSUANCE
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT Session Token expiring in 24 hours
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ==========================================
// 👤 3. GET PROFILE DATA (/auth/me)
// ==========================================
router.get('/me', protect, async (req, res) => {
  res.status(200).json(req.user);
});

export default router;
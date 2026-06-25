import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

// Global application-level memory array to hold temporary mock users
const mockUserDatabase = [];

export const authService = {
  /**
   * Hashes a password and registers a user account in the mock database array
   */
  registerUser: async (name, email, password) => {
    // Check if user already exists in our mock database
    const existingUser = mockUserDatabase.find(u => u.email === email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    // Securely hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = {
      id: String(mockUserDatabase.length + 1),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'operator'
    };

    mockUserDatabase.push(newUser);
    
    // Return the user object without exposing the hashed password
    return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  },

  /**
   * Verifies credentials and generates a signed JWT token session
   */
  loginUser: async (email, password) => {
    const user = mockUserDatabase.find(u => u.email === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password combination.');
    }

    // Validate the raw password against the encrypted hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password combination.');
    }

    // Generate a secure JSON Web Token session signature
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    };
  }
};
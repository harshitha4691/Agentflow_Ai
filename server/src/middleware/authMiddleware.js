import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access Denied: Missing Authentication Token" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'SUPER_SECRET_JWT_KEY_SIGNATURE_9988');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or Expired Token Framework Validation Failure" });
  }
};
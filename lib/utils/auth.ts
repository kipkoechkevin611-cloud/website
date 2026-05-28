import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

const getJWTSecret = (): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET && process.env.NODE_ENV === "production") {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  if (!JWT_SECRET) {
    console.warn('JWT_SECRET not set - using fallback for development');
    return 'your-secret-key-change-in-production';
  }
  return JWT_SECRET;
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, getJWTSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, getJWTSecret()) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

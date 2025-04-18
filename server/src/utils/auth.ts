import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../types/models';

// Hash le mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare un mot de passe avec un hash
export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Génère un token JWT
export const generateToken = (user: NonNullable<UserModel>): string => {
  if (!user || !user.id) {
    throw new Error('Invalid user data for token generation');
  }

  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  
  return jwt.sign(
    { userId: user.id },
    jwtSecret,
    { expiresIn: '7d' }
  );
}; 
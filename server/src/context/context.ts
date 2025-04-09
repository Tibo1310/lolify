import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../types/models';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request;
  currentUser: UserModel | null;
}

interface JwtPayload {
  userId: string;
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
  // Récupérer le token d'authentification des headers
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let currentUser: UserModel | null = null;

  // Vérifier si le token est valide
  if (token) {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Récupérer l'utilisateur à partir de son ID dans le token
      if (decoded.userId) {
        currentUser = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
      }
    } catch (error) {
      console.error('Erreur d\'authentification :', error);
    }
  }

  return {
    prisma,
    req,
    currentUser,
  };
}; 
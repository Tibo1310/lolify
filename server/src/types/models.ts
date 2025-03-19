import type { PrismaClient } from '@prisma/client';

// Types extraites de la base de données
export type UserModel = Awaited<ReturnType<PrismaClient['user']['findUnique']>>;
export type ArticleModel = Awaited<ReturnType<PrismaClient['article']['findUnique']>>;
export type CommentModel = Awaited<ReturnType<PrismaClient['comment']['findUnique']>>;
export type LikeModel = Awaited<ReturnType<PrismaClient['like']['findUnique']>>; 
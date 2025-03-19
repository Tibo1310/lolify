import { Context } from '../context/context';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { UserModel } from '../types/models';

export const userResolvers = {
  Query: {
    me: (_: unknown, __: unknown, { currentUser }: Context) => {
      if (!currentUser) {
        throw new Error('Non authentifié');
      }
      return currentUser;
    },
    user: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      return user;
    },
    users: (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.user.findMany();
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { username: string; email: string; password: string; avatar?: string } },
      { prisma }: Context
    ) => {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: input.email },
            { username: input.username },
          ],
        },
      });

      if (existingUser) {
        throw new Error('Cet email ou nom d\'utilisateur est déjà utilisé');
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(input.password);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          username: input.username,
          email: input.email,
          password: hashedPassword,
          avatar: input.avatar,
        },
      });

      // Générer un token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      { prisma }: Context
    ) => {
      // Rechercher l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const passwordValid = await comparePasswords(input.password, user.password);

      if (!passwordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Générer un token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },

  User: {
    articles: (parent: UserModel, _: unknown, { prisma }: Context) => {
      return prisma.article.findMany({
        where: { authorId: parent.id },
      });
    },
    comments: (parent: UserModel, _: unknown, { prisma }: Context) => {
      return prisma.comment.findMany({
        where: { authorId: parent.id },
      });
    },
    likes: (parent: UserModel, _: unknown, { prisma }: Context) => {
      return prisma.like.findMany({
        where: { userId: parent.id },
      });
    },
  },
}; 
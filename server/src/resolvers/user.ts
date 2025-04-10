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
    user: async (
      _: unknown,
      { id, username }: { id?: string; username?: string },
      { prisma }: Context
    ) => {
      if (!id && !username) {
        throw new Error('Vous devez fournir soit un ID soit un nom d\'utilisateur');
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: id || undefined },
            { username: username || undefined }
          ]
        }
      });

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

    updateProfile: async (
      _: unknown,
      { input }: { input: { username?: string; email?: string; currentPassword: string; newPassword?: string } },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour mettre à jour votre profil');
      }

      // Vérifier le mot de passe actuel
      const passwordValid = await comparePasswords(input.currentPassword, currentUser.password);
      if (!passwordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Vérifier si le nouveau nom d'utilisateur ou email est déjà utilisé
      if (input.username || input.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { username: input.username },
              { email: input.email }
            ],
            NOT: {
              id: currentUser.id
            }
          }
        });

        if (existingUser) {
          throw new Error('Ce nom d\'utilisateur ou email est déjà utilisé');
        }
      }

      // Préparer les données de mise à jour
      const updateData: {
        username?: string;
        email?: string;
        password?: string;
      } = {};
      if (input.username) updateData.username = input.username;
      if (input.email) updateData.email = input.email;
      if (input.newPassword) {
        updateData.password = await hashPassword(input.newPassword);
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: updateData
      });

      return updatedUser;
    },

    deleteAccount: async (
      _: unknown,
      { password }: { password: string },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour supprimer votre compte');
      }

      // Vérifier le mot de passe
      const passwordValid = await comparePasswords(password, currentUser.password);

      if (!passwordValid) {
        throw new Error('Mot de passe incorrect');
      }

      // Supprimer l'utilisateur
      await prisma.user.delete({
        where: { id: currentUser.id },
      });

      return true;
    },
  },

  User: {
    articles: (parent: UserModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Utilisateur non trouvé');
      }
      return prisma.article.findMany({
        where: { authorId: parent.id },
      });
    },
    comments: (parent: UserModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Utilisateur non trouvé');
      }
      return prisma.comment.findMany({
        where: { authorId: parent.id },
      });
    },
    likes: (parent: UserModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Utilisateur non trouvé');
      }
      return prisma.like.findMany({
        where: { userId: parent.id },
      });
    },
  },
}; 
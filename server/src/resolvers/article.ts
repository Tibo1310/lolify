import { Context } from '../context/context';
import { ArticleModel } from '../types/models';

export const articleResolvers = {
  Query: {
    article: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error('Article non trouvé');
      }
      return article;
    },
    articles: async (
      _: unknown,
      { offset = 0, limit = 10, authorId }: { offset?: number; limit?: number; authorId?: string },
      { prisma }: Context
    ) => {
      const where = authorId ? { authorId } : {};
      
      return prisma.article.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    createArticle: async (
      _: unknown,
      { input }: { input: { title: string; content: string } },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour créer un article');
      }

      return prisma.article.create({
        data: {
          title: input.title,
          content: input.content,
          author: {
            connect: { id: currentUser.id },
          },
        },
      });
    },

    updateArticle: async (
      _: unknown,
      { id, input }: { id: string; input: { title?: string; content?: string } },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour modifier un article');
      }

      // Vérifier si l'article existe et si l'utilisateur en est l'auteur
      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        throw new Error('Article non trouvé');
      }

      if (article.authorId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à modifier cet article');
      }

      return prisma.article.update({
        where: { id },
        data: {
          title: input.title || undefined,
          content: input.content || undefined,
        },
      });
    },

    deleteArticle: async (
      _: unknown,
      { id }: { id: string },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour supprimer un article');
      }

      // Vérifier si l'article existe et si l'utilisateur en est l'auteur
      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        throw new Error('Article non trouvé');
      }

      if (article.authorId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer cet article');
      }

      await prisma.article.delete({
        where: { id },
      });

      return true;
    },

    toggleLike: async (
      _: unknown,
      { articleId }: { articleId: string },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour liker un article');
      }

      // Vérifier si l'article existe
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        throw new Error('Article non trouvé');
      }

      // Vérifier si l'utilisateur a déjà liké l'article
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_articleId: {
            userId: currentUser.id,
            articleId,
          },
        },
      });

      if (existingLike) {
        // Supprimer le like
        await prisma.like.delete({
          where: {
            userId_articleId: {
              userId: currentUser.id,
              articleId,
            },
          },
        });
      } else {
        // Créer le like
        await prisma.like.create({
          data: {
            user: {
              connect: { id: currentUser.id },
            },
            article: {
              connect: { id: articleId },
            },
          },
        });
      }

      // Retourner l'article mis à jour
      return prisma.article.findUnique({
        where: { id: articleId },
      });
    },
  },

  Article: {
    author: (parent: ArticleModel, _: unknown, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
    comments: (parent: ArticleModel, _: unknown, { prisma }: Context) => {
      return prisma.comment.findMany({
        where: { articleId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    likes: (parent: ArticleModel, _: unknown, { prisma }: Context) => {
      return prisma.like.findMany({
        where: { articleId: parent.id },
      });
    },
    likesCount: async (parent: ArticleModel, _: unknown, { prisma }: Context) => {
      const count = await prisma.like.count({
        where: { articleId: parent.id },
      });
      return count;
    },
  },
}; 
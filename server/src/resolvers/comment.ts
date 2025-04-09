import { Context } from '../context/context';
import { CommentModel } from '../types/models';

export const commentResolvers = {
  Query: {
    comments: async (
      _: unknown,
      { articleId }: { articleId: string },
      { prisma }: Context
    ) => {
      return prisma.comment.findMany({
        where: { articleId },
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    addComment: async (
      _: unknown,
      { input }: { input: { content: string; articleId: string } },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour ajouter un commentaire');
      }

      // Vérifier si l'article existe
      const article = await prisma.article.findUnique({
        where: { id: input.articleId },
      });

      if (!article) {
        throw new Error('Article non trouvé');
      }

      return prisma.comment.create({
        data: {
          content: input.content,
          author: {
            connect: { id: currentUser.id },
          },
          article: {
            connect: { id: input.articleId },
          },
        },
      });
    },

    deleteComment: async (
      _: unknown,
      { id }: { id: string },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour supprimer un commentaire');
      }

      // Vérifier si le commentaire existe et si l'utilisateur en est l'auteur
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new Error('Commentaire non trouvé');
      }

      if (comment.authorId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer ce commentaire');
      }

      await prisma.comment.delete({
        where: { id },
      });

      return true;
    },
  },

  Comment: {
    author: async (parent: CommentModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Commentaire non trouvé');
      }

      const author = await prisma.user.findUnique({
        where: { id: parent.authorId },
      });
      
      if (!author) {
        throw new Error('Auteur non trouvé');
      }
      
      return author;
    },
    article: async (parent: CommentModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Commentaire non trouvé');
      }

      const article = await prisma.article.findUnique({
        where: { id: parent.articleId },
      });
      
      if (!article) {
        throw new Error('Article non trouvé');
      }
      
      return article;
    },
  },
}; 
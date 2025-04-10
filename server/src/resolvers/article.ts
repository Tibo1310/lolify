import { Context } from '../context/context';
import { ArticleModel } from '../types/models';
import { Prisma } from '@prisma/client';

export const articleResolvers = {
  Query: {
    article: async (_: unknown, { id }: { id: string }, { prisma }: Context) => {
      const article = await prisma.article.findUnique({ where: { id } });
      if (!article) {
        throw new Error('Article non trouvé');
      }
      return article;
    },
    articles: async (parent: null, args: { offset?: number; limit?: number; authorId?: string; search?: string; authorUsername?: string }, context: Context) => {
      const where: Prisma.ArticleWhereInput = {};

      if (args.authorId) {
        where.authorId = args.authorId;
      }

      if (args.search) {
        const searchTerm = args.search.toLowerCase();
        where.OR = [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } }
        ];
      }

      if (args.authorUsername) {
        const authorTerm = args.authorUsername.toLowerCase();
        where.author = {
          username: {
            contains: authorTerm
          }
        };
      }

      return context.prisma.article.findMany({
        where,
        include: {
          author: true,
          likes: {
            include: {
              user: true
            }
          },
          comments: {
            include: {
              author: true
            }
          }
        },
        skip: args.offset || 0,
        take: args.limit || 50,
        orderBy: {
          createdAt: 'desc'
        }
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
        include: {
          author: true,
          likes: true,
          comments: true
        }
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
        include: {
          author: true,
          likes: true,
          comments: true
        }
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

      // Stocker les informations de l'article avant de le supprimer
      const deletedArticleInfo = {
        id: article.id,
        title: article.title
      };

      await prisma.article.delete({
        where: { id },
      });

      return deletedArticleInfo;
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
        include: {
          author: true,
          likes: {
            include: {
              user: true
            }
          },
          comments: true
        }
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
          include: {
            user: true,
            article: true
          }
        });
      }

      // Retourner l'article mis à jour avec toutes les relations
      return prisma.article.findUnique({
        where: { id: articleId },
        include: {
          author: true,
          likes: {
            include: {
              user: true
            }
          },
          comments: {
            include: {
              author: true
            }
          }
        }
      });
    },
  },

  Article: {
    author: async (parent: ArticleModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Article non trouvé');
      }
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
    comments: async (parent: ArticleModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Article non trouvé');
      }
      return prisma.comment.findMany({
        where: { articleId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
    likes: async (parent: ArticleModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Article non trouvé');
      }
      return prisma.like.findMany({
        where: { articleId: parent.id },
      });
    },
    likesCount: async (parent: ArticleModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Article non trouvé');
      }
      const count = await prisma.like.count({
        where: { articleId: parent.id },
      });
      return count;
    },
  },
}; 
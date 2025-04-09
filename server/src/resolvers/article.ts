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
    articles: async (
      _: unknown,
      { offset = 0, limit = 10, authorId, search }: { offset?: number; limit?: number; authorId?: string; search?: string },
      { prisma }: Context
    ) => {
      // Construire la condition where
      let where: Prisma.ArticleWhereInput = {};
      
      // Ajouter le filtre par auteur si spécifié
      if (authorId) {
        where.authorId = authorId;
      }
      
      // Ajouter la recherche si spécifiée
      if (search) {
        const searchTerm = search.toLowerCase();
        where.OR = [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } }
        ];
      }
      
      // Si une recherche est effectuée, on doit d'abord récupérer tous les articles
      // puis filtrer ceux dont l'auteur correspond à la recherche
      const articles = await prisma.article.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          likes: true,
          comments: true
        }
      });

      // Si une recherche est effectuée, filtrer également par nom d'auteur
      if (search) {
        const searchTerm = search.toLowerCase();
        return articles.filter(article => 
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.author.username.toLowerCase().includes(searchTerm)
        );
      }

      return articles;
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
        include: {
          author: true,
          likes: true,
          comments: true
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
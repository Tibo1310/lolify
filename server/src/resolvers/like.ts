import { Context } from '../context/context';
import { LikeModel } from '../types/models';

export const likeResolvers = {
  Like: {
    user: async (parent: LikeModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Like non trouvé');
      }
      const user = await prisma.user.findUnique({
        where: { id: parent.userId }
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      return user;
    },
    article: async (parent: LikeModel | null, _: unknown, { prisma }: Context) => {
      if (!parent) {
        throw new Error('Like non trouvé');
      }
      const article = await prisma.article.findUnique({
        where: { id: parent.articleId }
      });
      if (!article) {
        throw new Error('Article non trouvé');
      }
      return article;
    }
  }
}; 
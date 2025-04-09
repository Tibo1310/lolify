import { userResolvers } from './user';
import { articleResolvers } from './article';
import { commentResolvers } from './comment';
import { likeResolvers } from './like';
import { GraphQLScalarType, Kind } from 'graphql';

// Résolveur pour le type scalar DateTime
const dateScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString(); // Convertir Date en string ISO
    }
    throw new Error('GraphQL DateTime Scalar serialize: value is not a Date');
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value); // Convertir string ISO en Date
    }
    throw new Error('GraphQL DateTime Scalar parseValue: expected string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Convertir AST string en Date
    }
    return null;
  },
});

// Combiner tous les résolveurs
export const resolvers = {
  DateTime: dateScalar,
  Query: {
    ...userResolvers.Query,
    ...articleResolvers.Query,
    ...commentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...articleResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  User: userResolvers.User,
  Article: articleResolvers.Article,
  Comment: commentResolvers.Comment,
  Like: likeResolvers.Like,
}; 
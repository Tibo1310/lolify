import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;

export const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle($input: ArticleInput!) {
    createArticle(input: $input) {
      id
      title
      content
      createdAt
      author {
        id
        username
        avatar
      }
    }
  }
`;

export const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle($id: ID!, $input: ArticleUpdateInput!) {
    updateArticle(id: $id, input: $input) {
      id
      title
      content
      updatedAt
    }
  }
`;

export const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;

export const ADD_COMMENT_MUTATION = gql`
  mutation AddComment($input: CommentInput!) {
    addComment(input: $input) {
      id
      content
      createdAt
      author {
        id
        username
        avatar
      }
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const TOGGLE_LIKE_MUTATION = gql`
  mutation ToggleLike($articleId: ID!) {
    toggleLike(articleId: $articleId) {
      id
      likesCount
      likes {
        id
        user {
          id
          username
        }
      }
    }
  }
`; 
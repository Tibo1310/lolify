import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($offset: Int, $limit: Int, $search: String, $authorUsername: String) {
    articles(offset: $offset, limit: $limit, search: $search, authorUsername: $authorUsername) {
      id
      title
      content
      createdAt
      author {
        id
        username
        avatar
      }
      likesCount
    }
  }
`;

export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      createdAt
      updatedAt
      likesCount
      author {
        id
        username
        avatar
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
          avatar
        }
      }
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

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      createdAt
      avatar
      articles {
        id
        title
        content
        createdAt
        likesCount
      }
      comments {
        id
        content
        createdAt
        article {
          id
          title
        }
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      createdAt
      avatar
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    user(username: $username) {
      id
      username
      email
      createdAt
      avatar
      articles {
        id
        title
        content
        createdAt
        likesCount
        author {
          id
          username
          avatar
        }
      }
    }
  }
`;

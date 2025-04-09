import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { formatDate } from '../utils/formatters';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../context/AuthContext';
import { GET_ARTICLE } from '../graphql/queries';
import { 
  TOGGLE_LIKE_MUTATION, 
  ADD_COMMENT_MUTATION, 
  DELETE_ARTICLE,
  DELETE_COMMENT_MUTATION 
} from '../graphql/mutations';

interface Like {
  id: string;
  user: {
    id: string;
    username: string;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
}

interface Author {
  id: string;
  username: string;
  avatar: string | null;
}

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  likes: Like[];
  likesCount: number;
  comments: Comment[];
}

interface ArticleData {
  article: Article;
}

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Fetch article data
  const { loading, error, data } = useQuery<ArticleData>(GET_ARTICLE, {
    variables: { id },
    skip: !id
  });
  
  // Mutations
  const [toggleLike] = useMutation(TOGGLE_LIKE_MUTATION, {
    update(cache, { data: { toggleLike: updatedArticle } }) {
      cache.writeQuery<ArticleData>({
        query: GET_ARTICLE,
        variables: { id },
        data: { article: updatedArticle }
      });
    }
  });

  const [addComment] = useMutation(ADD_COMMENT_MUTATION, {
    update(cache, { data: { addComment: newComment } }) {
      const existingArticle = cache.readQuery<ArticleData>({
        query: GET_ARTICLE,
        variables: { id }
      });
      if (existingArticle?.article) {
        cache.writeQuery<ArticleData>({
          query: GET_ARTICLE,
          variables: { id },
          data: {
            article: {
              ...existingArticle.article,
              comments: [...existingArticle.article.comments, newComment]
            }
          }
        });
      }
    }
  });

  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      navigate('/');
    }
  });

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    refetchQueries: [{
      query: GET_ARTICLE,
      variables: { id }
    }]
  });
  
  // State for loading states
  const [addingComment, setAddingComment] = useState(false);
  const [likingArticle, setLikingArticle] = useState(false);
  
  const article = data?.article;
  const isAuthor = user?.id === article?.author.id;
  const hasLiked = article?.likes.some((like: Like) => like.user.id === user?.id);
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setLikingArticle(true);
      await toggleLike({
        variables: { articleId: id }
      });
    } catch (error) {
      console.error('Erreur lors du like :', error);
    } finally {
      setLikingArticle(false);
    }
  };
  
  const handleAddComment = async (content: string, articleId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setAddingComment(true);
      await addComment({
        variables: { 
          input: {
            articleId,
            content
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
    } finally {
      setAddingComment(false);
    }
  };
  
  const handleDeleteArticle = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticle({
          variables: { id }
        });
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({
        variables: { id: commentId }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-league-gold"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
        Une erreur est survenue lors du chargement de l'article.
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <Link 
          to="/" 
          className="inline-block bg-league-gold text-league-dark font-bold py-2 px-4 rounded hover:bg-league-teal transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/articles" className="text-league-teal hover:text-league-gold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Retour aux articles</span>
        </Link>
      </div>
      
      <article className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center mb-6">
            {article.author.avatar ? (
              <img 
                src={article.author.avatar} 
                alt={`Avatar de ${article.author.username}`} 
                className="w-10 h-10 rounded-full mr-3 object-cover" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-league-blue flex items-center justify-center mr-3">
                <span className="text-league-gold font-bold">{article.author.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <Link to={`/profile/${article.author.username}`} className="text-league-teal hover:text-league-gold">
                {article.author.username}
              </Link>
              <p className="text-gray-400 text-sm">{formatDate(article.createdAt)}</p>
            </div>
          </div>
          
          <div className="prose prose-invert prose-gold max-w-none mb-6 whitespace-pre-wrap">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-between items-center pt-4 border-t border-league-gold/20">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 ${hasLiked ? 'text-league-gold' : 'text-gray-400'} hover:text-league-gold transition-colors`}
                disabled={likingArticle || !isAuthenticated}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill={hasLiked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24" 
                  stroke="black"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{article.likesCount}</span>
              </button>
              
              <span className="text-gray-400">|</span>
              
              <div className="text-gray-400">
                {article.comments.length} commentaire{article.comments.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex items-center gap-3">
                <Link
                  to={`/articles/${article.id}/edit`}
                  className="text-league-teal hover:text-league-gold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </Link>
                
                <button
                  onClick={handleDeleteArticle}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Commentaires</h2>
          
          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Commentaires ({article.comments.length})</h2>
            
            {isAuthenticated ? (
              <CommentForm 
                articleId={article.id} 
                onSubmit={handleAddComment}
                loading={addingComment}
              />
            ) : (
              <p className="text-gray-400 mb-4">
                <Link to="/login" className="text-league-teal hover:text-league-gold">Connectez-vous</Link> pour laisser un commentaire
              </p>
            )}
            
            <div className="space-y-4">
              {article.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  id={comment.id}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  author={comment.author}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage; 
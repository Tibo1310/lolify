import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';
import { DELETE_ARTICLE } from '../graphql/mutations';
import { GET_ARTICLES } from '../graphql/queries';

interface Author {
  id: string;
  username: string;
  avatar?: string | null;
}

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  likesCount: number;
}

interface ArticleCardProps {
  article: Article;
  showActions?: boolean;
}

const ArticleCard = ({ article, showActions = true }: ArticleCardProps) => {
  const { user } = useAuth();
  const isAuthor = user?.id === article.author.id;

  console.log('Current user:', user); // Debug
  console.log('Article author:', article.author); // Debug
  console.log('Is author?', isAuthor); // Debug

  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    update(cache) {
      // Mettre à jour le cache en supprimant l'article
      const existingArticles = cache.readQuery<{ articles: Article[] }>({
        query: GET_ARTICLES,
        variables: { offset: 0, limit: 50 }
      });

      if (existingArticles) {
        cache.writeQuery({
          query: GET_ARTICLES,
          variables: { offset: 0, limit: 50 },
          data: {
            articles: existingArticles.articles.filter(a => a.id !== article.id)
          }
        });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue lors de la suppression de l\'article');
    }
  });

  // Limiter le contenu à 150 caractères
  const truncatedContent = article.content.length > 150 
    ? `${article.content.substring(0, 150)}...` 
    : article.content;

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteArticle({
          variables: { id: article.id }
        });
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  return (
    <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
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
          
          {showActions && isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/articles/${article.id}/edit`}
                className="text-league-teal hover:text-league-gold"
                title="Modifier l'article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-400"
                title="Supprimer l'article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2">
          <Link to={`/articles/${article.id}`} className="hover:text-league-teal">
            {article.title}
          </Link>
        </h2>
        
        <p className="text-gray-300 mb-4">{truncatedContent}</p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/articles/${article.id}`}
            className="text-league-teal hover:text-league-gold font-medium"
          >
            Lire la suite →
          </Link>
          
          <div className="flex items-center gap-1 text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-league-gold" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>{article.likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';

interface Author {
  id: string;
  username: string;
  avatar?: string | null;
}

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  likesCount: number;
}

const ArticleCard = ({ id, title, content, createdAt, author, likesCount }: ArticleCardProps) => {
  // Limiter le contenu à 150 caractères
  const truncatedContent = content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content;

  return (
    <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {author.avatar ? (
            <img 
              src={author.avatar} 
              alt={`Avatar de ${author.username}`} 
              className="w-10 h-10 rounded-full mr-3 object-cover" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-league-blue flex items-center justify-center mr-3">
              <span className="text-league-gold font-bold">{author.username.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div>
            <Link to={`/profile/${author.id}`} className="text-league-teal hover:text-league-gold">
              {author.username}
            </Link>
            <p className="text-gray-400 text-sm">{formatDate(createdAt)}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">
          <Link to={`/articles/${id}`} className="hover:text-league-teal">
            {title}
          </Link>
        </h2>
        
        <p className="text-gray-300 mb-4">{truncatedContent}</p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/articles/${id}`}
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
            <span>{likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 
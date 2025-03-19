import { timeAgo } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

interface Author {
  id: string;
  username: string;
  avatar?: string | null;
}

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  onDelete?: (id: string) => void;
}

const CommentItem = ({ id, content, createdAt, author, onDelete }: CommentItemProps) => {
  const { user } = useAuth();
  const isAuthor = user?.id === author.id;

  return (
    <div className="bg-league-dark/60 p-4 rounded-lg mb-4">
      <div className="flex items-start gap-3">
        {author.avatar ? (
          <img 
            src={author.avatar} 
            alt={`Avatar de ${author.username}`} 
            className="w-10 h-10 rounded-full object-cover" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-league-blue flex items-center justify-center">
            <span className="text-league-gold font-bold">{author.username.charAt(0).toUpperCase()}</span>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-league-gold">{author.username}</p>
              <p className="text-sm text-gray-400">{timeAgo(createdAt)}</p>
            </div>
            
            {isAuthor && onDelete && (
              <button 
                onClick={() => onDelete(id)}
                className="text-gray-400 hover:text-league-red text-sm bg-transparent"
              >
                Supprimer
              </button>
            )}
          </div>
          
          <p className="mt-2 text-gray-200">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 
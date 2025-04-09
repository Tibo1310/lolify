import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatters';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../context/AuthContext';
// Nous importerons ces hooks une fois générés
// import { useGetArticleQuery, useToggleLikeMutation, useAddCommentMutation, useDeleteCommentMutation } from '../apollo/generated';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Simuler les données en attendant la génération des hooks
  const loading = false;
  const error = null;
  
  // Gestion des commentaires et likes
  const [addingComment, setAddingComment] = useState(false);
  const [likingArticle, setLikingArticle] = useState(false);
  
  // Données simulées pour le développement
  const article = {
    id: id || 'article-1',
    title: 'Comment devenir meilleur à League of Legends',
    content: `
    # Les bases pour s'améliorer
    
    League of Legends est un jeu complexe qui nécessite beaucoup de pratique et de connaissances pour progresser. Voici quelques conseils pour vous aider à vous améliorer :
    
    ## 1. Maîtrisez quelques champions
    
    Au lieu d'essayer de jouer tous les champions, concentrez-vous sur 2-3 champions par rôle. Cela vous permettra de vous concentrer sur la macro du jeu plutôt que sur les mécaniques spécifiques à chaque champion.
    
    ## 2. Améliorez votre farm
    
    Le farm est l'un des aspects les plus importants du jeu. Essayez de viser 7-8 CS par minute.
    
    ## 3. Regardez des replays de vos parties
    
    Analyser vos erreurs est la meilleure façon de vous améliorer. Prenez le temps de regarder vos replays et d'identifier les moments où vous auriez pu faire mieux.
    
    ## 4. La vision est cruciale
    
    Peu importe votre rôle, achetez et placez des wards. La vision donne des informations précieuses et peut sauver des vies.
    `,
    createdAt: new Date(2023, 10, 15).toISOString(),
    updatedAt: new Date(2023, 10, 15).toISOString(),
    author: {
      id: 'user-1',
      username: 'ProGamer123',
      avatar: null
    },
    comments: Array(3).fill(null).map((_, index) => ({
      id: `comment-${index + 1}`,
      content: `Ceci est un commentaire de test #${index + 1}. Il sera remplacé par de vrais commentaires une fois que l'API sera connectée.`,
      createdAt: new Date(2023, 10, 16 + index).toISOString(),
      author: {
        id: `user-${(index % 2) + 2}`,
        username: `user${(index % 2) + 2}`,
        avatar: null
      }
    })),
    likes: [
      { id: 'like-1', user: { id: 'user-2', username: 'user2' } },
      { id: 'like-2', user: { id: 'user-3', username: 'user3' } }
    ],
    likesCount: 2
  };
  
  const isAuthor = user?.id === article.author.id;
  const hasLiked = article.likes.some(like => like.user.id === user?.id);
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      setLikingArticle(true);
      // Simulation du toggle like
      console.log(`Toggle like sur l'article ${id}`);
      // Ici nous appellerions la mutation toggleLike
      setLikingArticle(false);
    } catch (error) {
      console.error('Erreur lors du like :', error);
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
      // Simulation de l'ajout de commentaire
      console.log(`Ajouter commentaire à l'article ${articleId}: ${content}`);
      // Ici nous appellerions la mutation addComment
      setAddingComment(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
      setAddingComment(false);
    }
  };
  
  const handleDeleteArticle = async () => {
    // Cette fonctionnalité sera implémentée plus tard
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      console.log(`Supprimer l'article ${id}`);
      navigate('/');
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
        <Link to="/" className="text-league-teal hover:text-league-gold flex items-center gap-2">
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
              <Link to={`/profile/${article.author.id}`} className="text-league-teal hover:text-league-gold">
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
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{article.likesCount} {article.likesCount > 1 ? 'likes' : 'like'}</span>
              </button>
              
              <span className="text-gray-400">|</span>
              
              <div className="text-gray-400">
                {article.comments.length} {article.comments.length > 1 ? 'commentaires' : 'commentaire'}
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Link 
                  to={`/articles/${article.id}/edit`}
                  className="bg-league-teal text-league-dark px-3 py-1 rounded text-sm hover:bg-league-teal/80"
                >
                  Modifier
                </Link>
                <button 
                  onClick={handleDeleteArticle}
                  className="bg-league-red text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
        
        {isAuthenticated ? (
          <CommentForm 
            articleId={article.id}
            onSubmit={handleAddComment}
            loading={addingComment}
          />
        ) : (
          <div className="bg-league-dark/50 p-4 rounded-lg mb-8 text-center">
            <p className="mb-3">Connectez-vous pour ajouter un commentaire</p>
            <Link 
              to="/login" 
              className="inline-block bg-league-gold text-league-dark font-bold py-2 px-4 rounded hover:bg-league-teal transition-colors"
            >
              Se connecter
            </Link>
          </div>
        )}
        
        <div className="space-y-4">
          {article.comments.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
          ) : (
            article.comments.map(comment => (
              <CommentItem 
                key={comment.id}
                id={comment.id}
                content={comment.content}
                createdAt={comment.createdAt}
                author={comment.author}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlePage; 
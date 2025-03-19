import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import ArticleCard from '../components/ArticleCard';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Données simulées pour le développement
  const profileUser = {
    id: 'user-1',
    username: username || 'ProGamer123',
    email: 'progamer123@example.com',
    createdAt: new Date(2023, 6, 15).toISOString(),
    bio: 'Passionné de League of Legends depuis la saison 3. Main jungle, spécialiste de Lee Sin et Elise. Je partage mes analyses et conseils pour progresser dans le jeu.',
    avatar: null,
    articlesCount: 12,
    commentsCount: 48
  };
  
  // Articles simulés pour le développement
  const userArticles = [
    {
      id: 'article-1',
      title: 'Comment devenir meilleur à League of Legends',
      content: 'Les conseils essentiels pour progresser rapidement et efficacement dans League of Legends, de la lane phase à la gestion du late game.',
      createdAt: new Date(2023, 10, 15).toISOString(),
      author: {
        id: 'user-1',
        username: profileUser.username,
        avatar: null
      },
      likesCount: 42
    },
    {
      id: 'article-2',
      title: 'Guide complet : jouer Lee Sin en jungle',
      content: 'Tout ce que vous devez savoir pour maîtriser Lee Sin en jungle : runes, build, ganks, combos et late game.',
      createdAt: new Date(2023, 9, 22).toISOString(),
      author: {
        id: 'user-1',
        username: profileUser.username,
        avatar: null
      },
      likesCount: 37
    },
    {
      id: 'article-3',
      title: 'Analyse du meta actuel (Patch 13.24)',
      content: 'Un aperçu des champions et stratégies dominants dans le patch actuel, avec conseils pour s\'adapter aux changements.',
      createdAt: new Date(2023, 11, 5).toISOString(),
      author: {
        id: 'user-1',
        username: profileUser.username,
        avatar: null
      },
      likesCount: 29
    }
  ];
  
  useEffect(() => {
    // Ici, nous simulons le chargement des données du profil
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      // En cas d'erreur, nous pourrions faire : setError('Message d'erreur');
    }, 500);
  }, [username]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-league-gold"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
        {error}
      </div>
    );
  }
  
  // Vérifier si l'utilisateur consulte son propre profil
  const isOwnProfile = user?.username === username;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-league-teal/20 flex items-center justify-center text-3xl font-bold text-league-teal">
              {profileUser.username.charAt(0).toUpperCase()}
            </div>
            
            {/* Informations du profil */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-2xl font-bold">{profileUser.username}</h1>
                
                {isOwnProfile && (
                  <Link 
                    to="/settings" 
                    className="mt-2 md:mt-0 inline-flex items-center text-league-teal hover:text-league-gold transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Modifier le profil
                  </Link>
                )}
              </div>
              
              <p className="text-gray-300 mb-4">{profileUser.bio}</p>
              
              <div className="text-sm text-gray-400 mb-4">
                <p>Membre depuis {formatDate(profileUser.createdAt)}</p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-league-dark/60 border border-league-gold/10 rounded px-3 py-1">
                  <span className="font-semibold text-league-gold">{profileUser.articlesCount}</span> articles
                </div>
                <div className="bg-league-dark/60 border border-league-gold/10 rounded px-3 py-1">
                  <span className="font-semibold text-league-gold">{profileUser.commentsCount}</span> commentaires
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Articles de l'utilisateur */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Articles publiés</h2>
          
          {isOwnProfile && (
            <Link 
              to="/articles/create" 
              className="bg-league-gold text-league-dark px-3 py-1 rounded font-medium hover:bg-league-teal transition-colors"
            >
              Nouvel article
            </Link>
          )}
        </div>
        
        {userArticles.length > 0 ? (
          <div className="space-y-4">
            {userArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                id={article.id}
                title={article.title}
                content={article.content}
                createdAt={article.createdAt}
                author={article.author}
                likesCount={article.likesCount}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-league-dark/40 border border-league-gold/10 rounded">
            <p className="text-gray-400">Aucun article publié pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 
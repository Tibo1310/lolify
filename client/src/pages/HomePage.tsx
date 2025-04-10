import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import ArticleCard from '../components/ArticleCard';
import { GET_ARTICLES } from '../graphql/queries';

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
  author: Author;
  likesCount: number;
}

interface ArticlesData {
  articles: Article[];
}

const HomePage = () => {
  const { user } = useAuth();
  const { loading: isLoading, error, data } = useQuery<ArticlesData>(GET_ARTICLES, {
    variables: { offset: 0, limit: 3 },
  });
  
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
        {error.message}
      </div>
    );
  }

  const articles = data?.articles || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Bannière / En-tête */}
      <div className="bg-gradient-to-r from-league-dark to-league-dark/70 border border-league-gold/30 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bienvenue sur Lolify</h1>
          <p className="text-xl text-gray-300 mb-6">
            La communauté francophone pour partager et découvrir des stratégies, guides et analyses sur League of Legends
          </p>
          
          {user ? (
            <Link 
              to="/articles/create" 
              className="inline-block bg-league-gold text-league-dark px-5 py-3 rounded-lg font-bold hover:bg-league-teal transition-colors"
            >
              Publier un article
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/login" 
                className="inline-block bg-league-teal text-white px-5 py-3 rounded-lg font-bold hover:bg-league-teal/80 transition-colors"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="inline-block bg-league-gold text-league-dark px-5 py-3 rounded-lg font-bold hover:bg-league-gold/80 transition-colors"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Articles récents */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Articles récents</h2>
          
          <Link 
            to="/articles" 
            className="text-league-teal hover:text-league-gold transition-colors"
          >
            Voir tous les articles →
          </Link>
        </div>
        
        {articles.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Aucun article pour le moment</p>
            {user && (
              <Link 
                to="/articles/create" 
                className="inline-block bg-league-gold text-league-dark px-4 py-2 rounded font-medium hover:bg-league-teal transition-colors"
              >
                Publier le premier article
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Section communautaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-league-dark border border-league-gold/30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Rejoignez la communauté</h3>
          <p className="text-gray-300 mb-4">
            Partagez vos connaissances, posez des questions et connectez-vous avec d&apos;autres joueurs passionnés de League of Legends.
          </p>
          {!user && (
            <Link 
              to="/register" 
              className="inline-block bg-league-gold text-league-dark px-4 py-2 rounded font-medium hover:bg-league-teal transition-colors"
            >
              Créer un compte
            </Link>
          )}
        </div>
        
        <div className="bg-league-dark border border-league-gold/30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Restez informés</h3>
          <p className="text-gray-300 mb-4">
            Suivez les dernières actualités, mises à jour et analyses du meta pour rester au top de votre jeu.
          </p>
          {!user && (
            <Link 
              to="/login" 
              className="inline-block bg-league-teal text-white px-4 py-2 rounded font-medium hover:bg-league-teal/80 transition-colors"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
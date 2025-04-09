import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { useAuth } from '../context/AuthContext';
// Nous importerons ces hooks une fois générés
// import { useGetArticlesQuery } from '../apollo/generated';

const HomePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);
  
  // Articles simulés pour le développement
  const recentArticles = [
    {
      id: 'article-1',
      title: 'Comment devenir meilleur à League of Legends',
      content: 'Les conseils essentiels pour progresser rapidement et efficacement dans League of Legends, de la lane phase à la gestion du late game.',
      createdAt: new Date(2023, 10, 15).toISOString(),
      author: {
        id: 'user-1',
        username: 'ProGamer123',
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
        id: 'user-2',
        username: 'JungleKing',
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
        id: 'user-3',
        username: 'LolAnalyst',
        avatar: null
      },
      likesCount: 29
    },
    {
      id: 'article-4',
      title: 'Top 5 des champions pour chaque rôle en SoloQ',
      content: 'Découvrez les champions les plus performants pour chaque rôle dans le patch actuel. Idéal pour grimper en SoloQ.',
      createdAt: new Date(2023, 11, 10).toISOString(),
      author: {
        id: 'user-4',
        username: 'RankClimber',
        avatar: null
      },
      likesCount: 54
    },
    {
      id: 'article-5',
      title: 'Comment améliorer sa vision dans League of Legends',
      content: 'La vision est l\'un des aspects les plus négligés mais les plus importants du jeu. Apprenez comment l\'optimiser dans vos parties.',
      createdAt: new Date(2023, 11, 8).toISOString(),
      author: {
        id: 'user-5',
        username: 'SupportMain',
        avatar: null
      },
      likesCount: 32
    }
  ];
  
  useEffect(() => {
    // Ici, nous simulons le chargement des articles récents
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      // En cas d'erreur, nous pourrions faire : setError('Message d'erreur');
    }, 500);
  }, []);
  
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
        
        {recentArticles.length > 0 ? (
          <div className="space-y-6">
            {recentArticles.map((article) => (
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
            Partagez vos connaissances, posez des questions et connectez-vous avec d'autres joueurs passionnés de League of Legends.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-league-gold text-league-dark px-4 py-2 rounded font-medium hover:bg-league-teal transition-colors"
          >
            Créer un compte
          </Link>
        </div>
        
        <div className="bg-league-dark border border-league-gold/30 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Restez informés</h3>
          <p className="text-gray-300 mb-4">
            Suivez les dernières actualités, mises à jour et analyses du meta pour rester au top de votre jeu.
          </p>
          <div className="flex gap-4">
            <a 
              href="#" 
              className="text-league-teal hover:text-league-gold"
              aria-label="Discord"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a 
              href="#" 
              className="text-league-teal hover:text-league-gold"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675c0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646a4.118 4.118 0 001.804-2.27a8.224 8.224 0 01-2.605.996a4.107 4.107 0 00-6.993 3.743a11.65 11.65 0 01-8.457-4.287a4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022a4.095 4.095 0 01-1.853.07a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a 
              href="#" 
              className="text-league-teal hover:text-league-gold"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
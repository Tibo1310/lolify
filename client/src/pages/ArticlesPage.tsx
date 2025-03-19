import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArticleCard from '../components/ArticleCard';

const ArticlesPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('latest');
  
  // Articles simulés pour le développement
  const articles = [
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
    },
    {
      id: 'article-6',
      title: 'L\'importance du CS dans League of Legends',
      content: 'Le farm est souvent négligé en bas ELO, mais c\'est l\'une des compétences les plus importantes pour progresser. Voici comment l\'améliorer.',
      createdAt: new Date(2023, 10, 2).toISOString(),
      author: {
        id: 'user-2',
        username: 'JungleKing',
        avatar: null
      },
      likesCount: 27
    },
    {
      id: 'article-7',
      title: 'Comment jouer en équipe en SoloQ',
      content: 'La SoloQ peut être frustrante, mais voici comment mieux jouer en équipe même avec des inconnus pour augmenter vos chances de victoire.',
      createdAt: new Date(2023, 11, 1).toISOString(),
      author: {
        id: 'user-1',
        username: 'ProGamer123',
        avatar: null
      },
      likesCount: 36
    },
    {
      id: 'article-8',
      title: 'Les meilleurs supports pour la saison 14',
      content: 'Avec la nouvelle saison qui arrive, découvrez quels supports seront les plus performants sur la Faille de l\'invocateur.',
      createdAt: new Date(2023, 10, 25).toISOString(),
      author: {
        id: 'user-5',
        username: 'SupportMain',
        avatar: null
      },
      likesCount: 22
    }
  ];
  
  useEffect(() => {
    // Ici, nous simulons le chargement des articles
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      // En cas d'erreur, nous pourrions faire : setError('Message d'erreur');
    }, 500);
  }, [activeFilter]);
  
  // Filtrer les articles en fonction de la recherche
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Trier les articles en fonction du filtre actif
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (activeFilter === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (activeFilter === 'popular') {
      return b.likesCount - a.likesCount;
    } else {
      return 0; // Pas de tri
    }
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Tous les articles</h1>
        
        {user && (
          <Link 
            to="/articles/create" 
            className="inline-flex items-center bg-league-gold text-league-dark px-4 py-2 rounded font-medium hover:bg-league-teal transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Publier un article
          </Link>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-league-dark/70 border border-league-gold/30 focus:border-league-gold focus:outline-none"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('latest')}
              className={`px-3 py-2 rounded-lg ${
                activeFilter === 'latest'
                  ? 'bg-league-gold text-league-dark font-medium'
                  : 'bg-league-dark/70 border border-league-gold/30 hover:bg-league-dark'
              }`}
            >
              Plus récents
            </button>
            <button
              onClick={() => handleFilterChange('popular')}
              className={`px-3 py-2 rounded-lg ${
                activeFilter === 'popular'
                  ? 'bg-league-gold text-league-dark font-medium'
                  : 'bg-league-dark/70 border border-league-gold/30 hover:bg-league-dark'
              }`}
            >
              Plus populaires
            </button>
          </div>
        </div>
      </div>
      
      {sortedArticles.length > 0 ? (
        <div className="space-y-6">
          {sortedArticles.map((article) => (
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
        <div className="text-center py-12 bg-league-dark/40 border border-league-gold/10 rounded">
          {searchQuery ? (
            <div>
              <p className="text-gray-400 mb-2">Aucun article trouvé pour "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-league-teal hover:text-league-gold"
              >
                Effacer la recherche
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Aucun article disponible</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage; 
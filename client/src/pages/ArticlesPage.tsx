import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
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

const ArticlesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('latest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Effet pour le debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const { loading: isLoading, error, data } = useQuery<ArticlesData>(GET_ARTICLES, {
    variables: { 
      offset: 0, 
      limit: 50,
      search: debouncedSearch || undefined
    },
  }); 
  
  // Trier les articles en fonction du filtre actif
  const sortedArticles = data?.articles ? [...data.articles].sort((a, b) => {
    const multiplier = sortDirection === 'desc' ? 1 : -1;
    
    if (activeFilter === 'latest') {
      return multiplier * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeFilter === 'popular') {
      return multiplier * (b.likesCount - a.likesCount);
    }
    return 0;
  }) : [];

  // Si le filtre est "popular", ne garder que les 5 premiers articles
  const displayedArticles = activeFilter === 'popular' ? sortedArticles.slice(0, 5) : sortedArticles;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filter: string) => {
    if (filter === 'latest' && activeFilter === 'latest') {
      // Si on clique sur le filtre actif "latest", on inverse juste le tri
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setActiveFilter(filter);
      // Réinitialiser le tri en ordre décroissant pour les nouveaux filtres
      setSortDirection('desc');
    }
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
        {error.message}
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
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-league-dark/70 border border-league-gold/30 focus:border-league-gold focus:outline-none text-white"
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFilterChange('latest')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === 'latest'
                    ? 'bg-league-gold text-league-dark'
                    : 'bg-league-dark/70 text-white hover:bg-league-dark'
                }`}
              >
                {activeFilter === 'latest' 
                  ? (sortDirection === 'desc' ? 'Plus récents' : 'Plus vieux')
                  : 'Plus récents'
                }
              </button>
            </div>
            <button
              onClick={() => handleFilterChange('popular')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === 'popular'
                  ? 'bg-league-gold text-league-dark'
                  : 'bg-league-dark/70 text-white hover:bg-league-dark'
              }`}
            >
              Plus populaires
            </button>
          </div>
        </div>
      </div>
      
      {displayedArticles.length > 0 ? (
        <div className="space-y-6">
          {displayedArticles.map((article) => (
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
          <p className="text-gray-400 mb-4">
            {searchQuery
              ? 'Aucun article ne correspond à votre recherche'
              : 'Aucun article pour le moment'}
          </p>
          {user && !searchQuery && (
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
  );
};

export default ArticlesPage; 
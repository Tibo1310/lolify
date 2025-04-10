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
  const [authorQuery, setAuthorQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedAuthorSearch, setDebouncedAuthorSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('latest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Debounce pour la recherche d'articles
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setDebouncedSearch]);

  // Debounce pour la recherche d'auteurs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAuthorSearch(authorQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [authorQuery, setDebouncedAuthorSearch]);
  
  const { loading, error, data } = useQuery<ArticlesData>(GET_ARTICLES, {
    variables: { 
      offset: 0, 
      limit: 50,
      search: debouncedSearch || undefined,
      authorUsername: debouncedAuthorSearch || undefined
    }
  }); 
  
  const articles = data?.articles || [];
  
  // Trier les articles
  const sortedArticles = [...articles].sort((a, b) => {
    if (activeFilter === 'latest') {
      return sortDirection === 'desc'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      // Pour le filtre "popular", trier par nombre de likes
      return sortDirection === 'desc'
        ? b.likesCount - a.likesCount
        : a.likesCount - b.likesCount;
    }
  });

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) {
      // Si on clique sur le filtre actif, on inverse juste le tri
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setActiveFilter(filter);
      // Réinitialiser le tri en ordre décroissant pour les nouveaux filtres
      setSortDirection('desc');
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
          <div className="relative flex gap-4 mb-6">
            <div className="relative flex-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-league-dark/70 border border-league-gold/30 focus:border-league-gold focus:outline-none text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un auteur..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-league-dark/70 border border-league-gold/30 focus:border-league-gold focus:outline-none text-white"
                value={authorQuery}
                onChange={(e) => setAuthorQuery(e.target.value)}
              />
            </div>
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
              {activeFilter === 'popular' 
                ? (sortDirection === 'desc' ? 'Plus populaires' : 'Moins populaires')
                : 'Plus populaires'
              }
            </button>
          </div>
        </div>
      </div>
      
      {sortedArticles.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {sortedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
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
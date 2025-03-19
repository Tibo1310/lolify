import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
// Nous importerons ces hooks une fois générés
// import { useGetArticlesQuery } from '../apollo/generated';

const HomePage = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  
  // Simuler les données en attendant la génération des hooks
  const loading = false;
  const error = null;
  const fetchMore = () => setOffset(prev => prev + limit);
  const hasMore = true;
  
  // Données simulées pour le développement
  const articles = Array(6).fill(null).map((_, index) => ({
    id: `article-${index + 1}`,
    title: `Article de test ${index + 1}`,
    content: `Ceci est un contenu d'article de test pour le développement. Il sera remplacé par les vrais articles une fois que l'API sera connectée. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere libero in quam interdum.`,
    createdAt: new Date(2023, 10, 15 - index).toISOString(),
    author: {
      id: `user-${index % 3 + 1}`,
      username: `user${index % 3 + 1}`,
      avatar: null
    },
    likesCount: Math.floor(Math.random() * 50)
  }));

  return (
    <div>
      <section className="mb-10">
        <div className="bg-league-dark/50 rounded-lg p-8 border border-league-gold/20 mb-10">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur Lolify</h1>
          <p className="text-xl mb-6 text-gray-300">
            Le réseau social dédié aux passionnés de League of Legends. 
            Partagez, commentez et connectez-vous avec la communauté.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-league-gold text-league-dark font-bold py-3 px-6 rounded-lg hover:bg-league-teal transition-colors"
          >
            Rejoindre la communauté
          </Link>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Articles récents</h2>
          <Link to="/articles/create" className="text-league-teal hover:text-league-gold">
            Créer un article
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-league-gold"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
            Une erreur est survenue lors du chargement des articles.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
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

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={fetchMore}
                  className="px-6 py-3 bg-league-dark border border-league-gold text-league-gold rounded-lg hover:bg-league-dark/50"
                >
                  Charger plus d'articles
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage; 
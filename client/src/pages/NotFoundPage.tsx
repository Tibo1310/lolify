import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <div className="mb-8">
        <span className="text-9xl font-bold text-league-gold">404</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Page introuvable</h1>
      
      <p className="text-gray-300 text-lg mb-8">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/"
          className="bg-league-gold text-league-dark px-6 py-3 rounded-lg font-bold hover:bg-league-teal transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        
        <Link 
          to="/articles"
          className="bg-league-dark border border-league-gold text-white px-6 py-3 rounded-lg font-bold hover:bg-league-dark/70 transition-colors"
        >
          Parcourir les articles
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8">Page non trouvée</h2>
      
      <div className="mb-8">
        <p className="text-gray-300 mb-2">
          La page que vous recherchez semble ne pas exister.
        </p>
        <p className="text-gray-300">
          Vérifiez l'URL ou revenez à la page d'accueil.
        </p>
      </div>
      
      <Link 
        to="/" 
        className="inline-block bg-league-gold text-league-dark font-bold py-3 px-6 rounded-lg hover:bg-league-teal transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage; 
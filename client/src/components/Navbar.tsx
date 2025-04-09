import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-league-dark py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-league-gold flex items-center">
          <span>LOLIFY</span>
        </Link>

        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-league-gold">
            Accueil
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/articles/create" className="hover:text-league-gold">
                Nouvel Article
              </Link>
              <Link to="/profile" className="flex items-center gap-2 hover:text-league-gold">
                <span>{user?.username}</span>
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={`Avatar de ${user.username}`} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-league-red hover:bg-red-700 text-white"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-league-gold">
                Connexion
              </Link>
              <Link 
                to="/register"
                className="bg-league-gold text-league-dark px-4 py-2 rounded hover:bg-league-teal"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
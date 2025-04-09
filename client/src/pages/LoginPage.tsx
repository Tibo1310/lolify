import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';
// Nous importerons ces hooks une fois générés
// import { useLoginMutation } from '../apollo/generated';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loginMutation, { loading: isLoading }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      // Gérer les erreurs de l'API GraphQL
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    }
  });
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Extraire le message de redirection s'il existe
  const message = location.state?.message;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation simple
    if (!email.trim()) {
      setError('L\'email est requis');
      return;
    }
    
    if (!password) {
      setError('Le mot de passe est requis');
      return;
    }
    
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email,
            password
          }
        }
      });
      
      if (data?.login) {
        const { token, user: userData } = data.login;
        login(token, userData);
        navigate('/');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      // L'erreur est déjà gérée par onError dans useMutation
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        
        {message && (
          <div className="bg-blue-900/20 border border-blue-500 text-blue-300 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="Votre email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="font-medium">
                Mot de passe
              </label>
              <Link to="/forgot-password" className="text-league-teal hover:text-league-gold text-sm">
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="Votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-league-gold text-league-dark py-2 px-4 rounded font-semibold hover:bg-league-teal transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          <p className="text-center text-gray-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-league-teal hover:text-league-gold">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 
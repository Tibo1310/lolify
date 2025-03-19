import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Nous importerons ces hooks une fois générés
// import { useLoginMutation } from '../apollo/generated';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Simuler la mutation en attendant la génération des hooks
  const [loginMutation, { loading }] = [
    async ({ variables }: any) => {
      // Simuler une connexion réussie
      if (email && password) {
        // Simulation d'une authentification réussie
        return {
          data: {
            login: {
              token: 'fake-jwt-token',
              user: {
                id: '1',
                username: 'utilisateur_test',
                email: variables.input.email,
                createdAt: new Date().toISOString(),
                avatar: null
              }
            }
          }
        };
      } else {
        throw new Error('Email ou mot de passe invalide');
      }
    },
    { loading: false }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Appeler la mutation de connexion
      const result = await loginMutation({
        variables: {
          input: {
            email,
            password
          }
        }
      });

      // Stocker le token et les informations utilisateur
      if (result?.data?.login) {
        login(result.data.login.token, result.data.login.user);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-center mb-8">Connexion</h1>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg p-8 shadow-lg">
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
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="font-medium">
                Mot de passe
              </label>
              <Link to="/forgot-password" className="text-sm text-league-teal hover:text-league-gold">
                Mot de passe oublié?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          <p className="text-center text-gray-400">
            Pas encore de compte? {' '}
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
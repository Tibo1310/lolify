import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Nous importerons ces hooks une fois générés
// import { useRegisterMutation } from '../apollo/generated';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Simuler la mutation en attendant la génération des hooks
  const [registerMutation, { loading }] = [
    async ({ variables }: any) => {
      // Vérifier que les mots de passe correspondent
      if (password !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      // Simuler une inscription réussie
      if (username && email && password) {
        // Simulation d'une inscription réussie
        return {
          data: {
            register: {
              token: 'fake-jwt-token',
              user: {
                id: '1',
                username: variables.input.username,
                email: variables.input.email,
                createdAt: new Date().toISOString(),
                avatar: null
              }
            }
          }
        };
      } else {
        throw new Error('Tous les champs sont obligatoires');
      }
    },
    { loading: false }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      // Appeler la mutation d'inscription
      const result = await registerMutation({
        variables: {
          input: {
            username,
            email,
            password
          }
        }
      });

      // Stocker le token et les informations utilisateur
      if (result?.data?.register) {
        login(result.data.register.token, result.data.register.user);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-center mb-8">Créer un compte</h1>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg p-8 shadow-lg">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-medium">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              placeholder="Votre nom d'utilisateur"
              required
            />
          </div>
          
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
          
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              Mot de passe
            </label>
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
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
          
          <p className="text-center text-gray-400">
            Déjà un compte? {' '}
            <Link to="/login" className="text-league-teal hover:text-league-gold">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql/mutations';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | React.ReactElement | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    onError: (error) => {
      setError(error.message || <span dangerouslySetInnerHTML={{ __html: 'Une erreur est survenue l&apos;inscription' }} />);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation des champs
    if (!username.trim()) {
      setError(<span dangerouslySetInnerHTML={{ __html: 'Le nom d&apos;utilisateur est requis' }} />);
      return;
    }

    if (!email.trim()) {
      setError(<span dangerouslySetInnerHTML={{ __html: 'L&apos;email est requis' }} />);
      return;
    }

    if (!password) {
      setError('Le mot de passe est requis');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            username,
            email,
            password
          }
        }
      });

      if (data?.register) {
        // Connecter l'utilisateur automatiquement après l'inscription
        const { token, user: userData } = data.register;
        login(token, userData);
        navigate('/');
      } else {
        setError(<span dangerouslySetInnerHTML={{ __html: 'Une erreur est survenue l&apos;inscription' }} />);
      }
    } catch (err) {
      // L'erreur est déjà gérée par onError dans useMutation
      console.error('Erreur d&apos;inscription:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Créer un compte</h1>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg p-8 shadow-lg">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {typeof error === 'string' ? error : error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-medium">
              <span dangerouslySetInnerHTML={{ __html: 'Nom d&apos;utilisateur' }} />
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              placeholder="Votre nom d&apos;utilisateur"
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-league-gold text-league-dark py-2 px-4 rounded font-semibold hover:bg-league-teal transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : <span dangerouslySetInnerHTML={{ __html: 'S&apos;inscrire' }} />}
          </button>
          
          <p className="text-center text-gray-400">
            Déjà un compte ?{' '}
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
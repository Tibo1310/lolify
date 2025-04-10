import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Initialisation des champs avec les infos utilisateur
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user, navigate]);
  
  // Gestion de la mise à jour du profil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    
    // Validation des champs
    if (!username.trim()) {
      setProfileError('Le nom d&apos;utilisateur est requis');
      return;
    }
    
    if (!email.trim()) {
      setProfileError('L&apos;email est requis');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler une mise à jour de profil
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfileSuccess(true);
      
      // Réinitialisation après 3 secondes
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error) {
      setProfileError('Une erreur s&apos;est produite lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gestion de la mise à jour du mot de passe
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validation des champs
    if (!currentPassword) {
      setPasswordError('Le mot de passe actuel est requis');
      return;
    }
    
    if (!newPassword) {
      setPasswordError('Le nouveau mot de passe est requis');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler une mise à jour de mot de passe
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPasswordSuccess(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setPasswordSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 3000);
    } catch (error) {
      setPasswordError('Une erreur s&apos;est produite lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gestion de la suppression du compte
  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        // Simuler une suppression de compte
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Déconnecter l'utilisateur
        logout();
        
        // Rediriger vers la page d'accueil
        navigate('/');
      } catch (error) {
        alert('Une erreur s&apos;est produite lors de la suppression du compte');
      }
    }
  };
  
  if (!user) {
    return null; // L'effet useEffect redirigera
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Paramètres du compte</h1>
      
      {/* Mise à jour du profil */}
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
        
        {profileError && (
          <div className="text-red-500 mb-4">
            Une erreur s&apos;est produite lors de la mise à jour du profil.
          </div>
        )}
        
        {profileSuccess && (
          <div className="bg-green-900/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
            Profil mis à jour avec succès !
          </div>
        )}
        
        <form onSubmit={handleProfileUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="username" className="block mb-2 font-medium">
                Nom d&apos;utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="bio" className="block mb-2 font-medium">
              Biographie
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-32"
              placeholder="Parlez de vous, vos champions préférés, votre expérience..."
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-league-gold text-league-dark px-4 py-2 rounded font-semibold hover:bg-league-teal transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Modification du mot de passe */}
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Changer de mot de passe</h2>
        
        {passwordError && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {passwordError}
          </div>
        )}
        
        {passwordSuccess && (
          <div className="bg-green-900/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
            Mot de passe mis à jour avec succès !
          </div>
        )}
        
        <form onSubmit={handlePasswordUpdate}>
          <div className="mb-4">
            <label htmlFor="current-password" className="block mb-2 font-medium">
              Mot de passe actuel
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="new-password" className="block mb-2 font-medium">
              Nouveau mot de passe
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block mb-2 font-medium">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-league-gold text-league-dark px-4 py-2 rounded font-semibold hover:bg-league-teal transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Zone dangereuse */}
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-red-300">Zone dangereuse</h2>
        <p className="text-red-300 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données, y compris vos articles et commentaires, seront définitivement perdues.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; 
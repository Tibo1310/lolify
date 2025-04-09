import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import ArticleCard from '../components/ArticleCard';
import { GET_USER_PROFILE, GET_ARTICLES } from '../graphql/queries';
import { UPDATE_PROFILE, DELETE_ACCOUNT } from '../graphql/mutations';

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

interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  avatar: string | null;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Requête pour obtenir les données du profil
  const { loading: profileLoading, data: profileData } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    skip: !username
  });

  // Mutation pour mettre à jour le profil
  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      setIsEditing(false);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  // Mutation pour supprimer le compte
  const [deleteAccount] = useMutation(DELETE_ACCOUNT, {
    onCompleted: () => {
      logout();
      navigate('/');
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  useEffect(() => {
    if (profileData?.user) {
      setFormData(prev => ({
        ...prev,
        username: profileData.user.username,
        email: profileData.user.email
      }));
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        variables: {
          input: formData
        }
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      const password = prompt('Veuillez entrer votre mot de passe pour confirmer la suppression :');
      if (password) {
        try {
          await deleteAccount({
            variables: { password }
          });
        } catch (err) {
          console.error('Erreur lors de la suppression du compte:', err);
        }
      }
    }
  };

  const sortedArticles = profileData?.user?.articles ? [...profileData.user.articles].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  }) : [];

  if (profileLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-league-gold"></div>
      </div>
    );
  }

  const isOwnProfile = user?.username === username;
  const profile = profileData?.user;

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Profil non trouvé</h1>
        <Link to="/" className="text-league-gold hover:text-league-teal">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500 text-red-300 p-4 rounded">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-league-dark/50 border border-league-gold/30 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-league-dark/50 border border-league-gold/30 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full bg-league-dark/50 border border-league-gold/30 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full bg-league-dark/50 border border-league-gold/30 rounded px-3 py-2"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-league-gold text-league-dark rounded hover:bg-league-teal"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-league-teal/20 flex items-center justify-center text-3xl font-bold text-league-teal">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  
                  {isOwnProfile && (
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center text-league-teal hover:text-league-gold transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Modifier le profil
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Supprimer le compte
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-300 mb-4">{profile.email}</p>
                
                <div className="text-sm text-gray-400 mb-4">
                  <p>Membre depuis {formatDate(profile.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Articles de l'utilisateur */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Articles publiés</h2>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center text-league-teal hover:text-league-gold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
              </svg>
              {sortOrder === 'desc' ? 'Plus récents' : 'Plus anciens'}
            </button>
            
            {isOwnProfile && (
              <Link 
                to="/articles/create" 
                className="bg-league-gold text-league-dark px-3 py-1 rounded font-medium hover:bg-league-teal transition-colors"
              >
                Nouvel article
              </Link>
            )}
          </div>
        </div>
        
        {sortedArticles.length > 0 ? (
          <div className="space-y-4">
            {sortedArticles.map((article) => (
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
        ) : (
          <div className="text-center py-8 bg-league-dark/40 border border-league-gold/10 rounded">
            <p className="text-gray-400">Aucun article publié pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 
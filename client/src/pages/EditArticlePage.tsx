import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Nous importerons ces hooks une fois générés
// import { useGetArticleQuery, useUpdateArticleMutation } from '../apollo/generated';

const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // Simulé pour le développement
  
  // Simuler les données en attendant la génération des hooks
  const articleLoading = false;
  const articleError = null;
  
  // Article simulé pour le développement
  const article = {
    id: id || 'article-1',
    title: 'Comment devenir meilleur à League of Legends',
    content: `# Les bases pour s'améliorer

League of Legends est un jeu complexe qui nécessite beaucoup de pratique et de connaissances pour progresser. Voici quelques conseils pour vous aider à vous améliorer :

## 1. Maîtrisez quelques champions

Au lieu d'essayer de jouer tous les champions, concentrez-vous sur 2-3 champions par rôle. Cela vous permettra de vous concentrer sur la macro du jeu plutôt que sur les mécaniques spécifiques à chaque champion.

## 2. Améliorez votre farm

Le farm est l'un des aspects les plus importants du jeu. Essayez de viser 7-8 CS par minute.

## 3. Regardez des replays de vos parties

Analyser vos erreurs est la meilleure façon de vous améliorer. Prenez le temps de regarder vos replays et d'identifier les moments où vous auriez pu faire mieux.

## 4. La vision est cruciale

Peu importe votre rôle, achetez et placez des wards. La vision donne des informations précieuses et peut sauver des vies.`,
    createdAt: new Date(2023, 10, 15).toISOString(),
    updatedAt: new Date(2023, 10, 15).toISOString(),
    author: {
      id: user?.id || 'user-1',
      username: user?.username || 'ProGamer123',
      avatar: null
    }
  };
  
  // Simuler la mutation en attendant la génération des hooks
  const [updateArticle, { loading: updateLoading }] = [
    async ({ variables }: any) => {
      // Simuler une mise à jour d'article réussie
      if (title && content) {
        // Simulation d'une mise à jour réussie
        return {
          data: {
            updateArticle: {
              id: id,
              title: variables.input.title,
              content: variables.input.content,
              updatedAt: new Date().toISOString()
            }
          }
        };
      } else {
        throw new Error('Le titre et le contenu sont obligatoires');
      }
    },
    { loading: false }
  ];
  
  // Charger les données de l'article
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      
      // Vérifier si l'utilisateur est l'auteur de l'article
      setIsAuthorized(user?.id === article.author.id);
    }
  }, [article, user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation des champs
    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }
    
    if (!content.trim()) {
      setError('Le contenu est obligatoire');
      return;
    }
    
    try {
      // Appeler la mutation de mise à jour d'article
      const result = await updateArticle({
        variables: {
          id,
          input: {
            title,
            content
          }
        }
      });

      // Rediriger vers la page de l'article mis à jour
      if (result?.data?.updateArticle) {
        navigate(`/articles/${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };
  
  // Si l'article est en cours de chargement
  if (articleLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-league-gold"></div>
      </div>
    );
  }
  
  // Si une erreur s'est produite lors du chargement de l'article
  if (articleError) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
        Une erreur est survenue lors du chargement de l'article.
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas autorisé à modifier cet article
  if (!isAuthorized) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-gray-300 mb-6">Vous n'êtes pas autorisé à modifier cet article.</p>
        <Link 
          to={`/articles/${id}`} 
          className="inline-block bg-league-gold text-league-dark font-bold py-2 px-4 rounded hover:bg-league-teal transition-colors"
        >
          Retour à l'article
        </Link>
      </div>
    );
  }
  
  // Formatage Markdown - aide à l'utilisateur
  const markdownTips = [
    { description: 'Titre', syntax: '# Titre' },
    { description: 'Sous-titre', syntax: '## Sous-titre' },
    { description: 'Liste à puces', syntax: '* Item\n* Item' },
    { description: 'Liste numérotée', syntax: '1. Item\n2. Item' },
    { description: 'Lien', syntax: '[texte](url)' },
    { description: 'Image', syntax: '![alt](url)' },
    { description: 'Texte en gras', syntax: '**texte**' },
    { description: 'Texte en italique', syntax: '*texte*' },
    { description: 'Citation', syntax: '> citation' },
    { description: 'Code', syntax: '`code`' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to={`/articles/${id}`} className="text-league-teal hover:text-league-gold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Retour à l'article</span>
        </Link>
      </div>
      
      <h1 className="text-center mb-8">Modifier l'article</h1>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg p-6 mb-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">
              Titre de l'article
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              placeholder="Titre de l'article"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 font-medium">
              Contenu (Markdown supporté)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64"
              placeholder="Contenu de l'article..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-league-gold text-league-dark px-4 py-2 rounded font-semibold hover:bg-league-teal transition-colors"
              disabled={updateLoading}
            >
              {updateLoading ? 'Mise à jour en cours...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-league-dark/60 border border-league-gold/20 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Aide Markdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {markdownTips.map((tip, index) => (
            <div key={index} className="border border-league-gold/10 rounded p-2">
              <p className="text-league-gold mb-1">{tip.description}</p>
              <code className="bg-league-dark p-1 rounded block">{tip.syntax}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditArticlePage; 
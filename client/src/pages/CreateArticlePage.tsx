import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_ARTICLE_MUTATION } from '../graphql/mutations';
import { GET_ARTICLES } from '../graphql/queries';

interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

interface CreateArticleData {
  createArticle: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      avatar: string | null;
    };
  };
}

interface CreateArticleVars {
  input: {
    title: string;
    content: string;
  };
}

const CreateArticlePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [createArticle, { loading }] = useMutation<CreateArticleData, CreateArticleVars>(
    CREATE_ARTICLE_MUTATION,
    {
      update(cache, { data }) {
        if (!data) return;
        
        // Mettre à jour le cache Apollo pour inclure le nouvel article
        const newArticle = data.createArticle;
        
        try {
          const existingArticles = cache.readQuery<{ articles: Article[] }>({
            query: GET_ARTICLES,
            variables: { offset: 0, limit: 10 },
          });

          if (existingArticles) {
            cache.writeQuery({
              query: GET_ARTICLES,
              variables: { offset: 0, limit: 10 },
              data: {
                articles: [newArticle, ...existingArticles.articles],
              },
            });
          }
        } catch (e) {
          console.error('Erreur lors de la mise à jour du cache:', e);
        }
      },
    }
  );

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
      // Appeler la mutation de création d'article
      const result = await createArticle({
        variables: {
          input: {
            title: title.trim(),
            content: content.trim()
          }
        }
      });

      // Rediriger vers la page de l'article créé
      if (result?.data?.createArticle) {
        navigate(`/articles/${result.data.createArticle.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };
  
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
        <Link to="/" className="text-league-teal hover:text-league-gold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Retour aux articles</span>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-8">Créer un nouvel article</h1>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg p-6 mb-8">
        {error && (
          <div className="text-red-500 mb-4">
            Une erreur s&apos;est produite l&apos;article.
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
              className="w-full bg-league-dark/50 border border-league-gold/30 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-league-gold"
              placeholder="Un titre accrocheur"
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
              className="w-full h-64 bg-league-dark/50 border border-league-gold/30 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-league-gold"
              placeholder="Rédigez votre article ici..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-league-gold text-league-dark px-6 py-3 rounded-lg font-semibold hover:bg-league-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Publication en cours...' : 'Publier l&apos;article'}
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

export default CreateArticlePage;
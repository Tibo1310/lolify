import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Nous importerons ces hooks une fois générés
// import { useCreateArticleMutation } from '../apollo/generated';

const CreateArticlePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Simuler la mutation en attendant la génération des hooks
  const [createArticle, { loading }] = [
    async ({ variables }: any) => {
      // Simuler une création d'article réussie
      if (title && content) {
        // Simulation d'une création réussie
        return {
          data: {
            createArticle: {
              id: 'new-article-id',
              title: variables.input.title,
              content: variables.input.content,
              createdAt: new Date().toISOString()
            }
          }
        };
      } else {
        throw new Error('Le titre et le contenu sont obligatoires');
      }
    },
    { loading: false }
  ];

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
            title,
            content
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
      
      <h1 className="text-center mb-8">Créer un nouvel article</h1>
      
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
              className="w-full h-64"
              placeholder="Rédigez votre article ici..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-league-gold text-league-dark px-4 py-2 rounded font-semibold hover:bg-league-teal transition-colors"
              disabled={loading}
            >
              {loading ? 'Publication en cours...' : 'Publier l\'article'}
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
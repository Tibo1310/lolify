import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { GET_ARTICLE } from '../graphql/queries';
import { UPDATE_ARTICLE_MUTATION } from '../graphql/mutations';

interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

interface ArticleData {
  article: Article;
}

const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Récupération des données de l'article
  const { loading: articleLoading, error: articleError, data } = useQuery<ArticleData>(GET_ARTICLE, {
    variables: { id },
    skip: !id
  });
  
  // Mutation pour mettre à jour l'article
  const [updateArticle, { loading: updateLoading }] = useMutation(UPDATE_ARTICLE_MUTATION, {
    onCompleted: () => {
      navigate(`/articles/${id}`);
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  // Récupération des données de l'article lorsqu'elles sont disponibles
  useEffect(() => {
    if (data?.article) {
      setTitle(data.article.title);
      setContent(data.article.content);
    }
  }, [data]);
  
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
      await updateArticle({
        variables: {
          id,
          input: {
            title: title.trim(),
            content: content.trim()
          }
        }
      });
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
  
  // Si une erreur s&apos;est produite lors du chargement de l&apos;article
  if (articleError) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
        Une erreur est survenue lors du chargement de l&apos;article.
      </div>
    );
  }
  
  // Si l&apos;utilisateur n&apos;est pas autorisé à modifier cet article
  const isAuthorized = user?.id === data?.article?.author.id;
  if (!isAuthorized) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-gray-300 mb-6">Vous n&apos;êtes pas autorisé à modifier cet article.</p>
        <Link 
          to={`/articles/${id}`} 
          className="inline-block bg-league-gold text-league-dark font-bold py-2 px-4 rounded hover:bg-league-teal transition-colors"
        >
          Retour à l&apos;article
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
          <span>Retour à l&apos;article</span>
        </Link>
      </div>
      
      <h1 className="text-center mb-8">Modifier l&apos;article</h1>
      
      <div className="bg-league-dark border border-league-gold/30 rounded-lg overflow-hidden shadow-lg p-6 mb-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">
              Titre de l&apos;article
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-league-dark text-white border border-league-gold/50 rounded-lg focus:border-league-gold focus:ring-2 focus:ring-league-gold/50"
              required
              disabled={updateLoading}
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
              className="w-full h-96 p-3 bg-league-dark text-white border border-league-gold/50 rounded-lg focus:border-league-gold focus:ring-2 focus:ring-league-gold/50 font-mono"
              required
              disabled={updateLoading}
            ></textarea>
            
            <div className="mt-2">
              <details className="text-sm text-gray-400">
                <summary className="cursor-pointer hover:text-gray-300">Aide Markdown</summary>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {markdownTips.map((tip, index) => (
                    <div key={index} className="p-2 bg-league-dark/40 rounded">
                      <p className="font-medium text-gray-300">{tip.description}</p>
                      <code className="text-xs text-league-gold">{tip.syntax}</code>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-league-gold text-league-dark font-semibold px-6 py-2 rounded-lg hover:bg-league-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mise à jour en cours...
                </span>
              ) : (
                'Mettre à jour'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticlePage; 
import { useState } from 'react';

interface CommentFormProps {
  articleId: string;
  onSubmit: (content: string, articleId: string) => Promise<void>;
  loading?: boolean;
}

const CommentForm = ({ articleId, onSubmit, loading = false }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      await onSubmit(content, articleId);
      setContent(''); // Réinitialisation du champ après soumission
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-2 font-medium">
          Ajouter un commentaire
        </label>
        <textarea
          id="comment"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 bg-league-dark text-white border border-league-gold/50 rounded-lg focus:border-league-gold focus:ring-2 focus:ring-league-gold/50"
          placeholder="Partagez votre point de vue..."
          disabled={loading}
          required
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-league-gold text-league-dark font-semibold px-4 py-2 rounded-lg hover:bg-league-teal transition-colors"
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          ) : (
            'Commenter'
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 
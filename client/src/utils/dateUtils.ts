/**
 * Formate une date en format lisible
 * @param dateString La date à formater sous forme de chaîne ISO
 * @returns La date formatée (ex: 15 juillet 2023)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Options pour le formatage de la date
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  // Formater la date en français
  return date.toLocaleDateString('fr-FR', options);
};

/**
 * Formate une date relative (il y a X jours, heures, etc.)
 * @param dateString La date à formater sous forme de chaîne ISO
 * @returns La date relative formatée
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Moins d'une minute
  if (diffInSeconds < 60) {
    return 'à l\'instant';
  }
  
  // Moins d'une heure
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return minutes === 1 
      ? 'il y a 1 minute' 
      : `il y a ${minutes} minutes`;
  }
  
  // Moins d'un jour
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 
      ? 'il y a 1 heure' 
      : `il y a ${hours} heures`;
  }
  
  // Moins d'une semaine
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 
      ? 'hier' 
      : `il y a ${days} jours`;
  }
  
  // Moins d'un mois
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return weeks === 1 
      ? 'il y a 1 semaine' 
      : `il y a ${weeks} semaines`;
  }
  
  // Moins d'un an
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return months === 1 
      ? 'il y a 1 mois' 
      : `il y a ${months} mois`;
  }
  
  // Plus d'un an
  const years = Math.floor(diffInSeconds / 31536000);
  return years === 1 
    ? 'il y a 1 an' 
    : `il y a ${years} ans`;
}; 
/**
 * Formate une date ISO en format lisible par l'utilisateur
 * @param dateString - Chaîne de date ISO à formater
 * @returns Chaîne de date formatée
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Options pour le formatage de la date
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleDateString('fr-FR', options);
};

/**
 * Crée une représentation relative du temps écoulé (ex: "il y a 5 minutes")
 * @param dateString - Chaîne de date ISO
 * @returns Chaîne de temps relatif
 */
export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Moins d'une minute
  if (seconds < 60) {
    return 'à l\'instant';
  }
  
  // Minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  // Heures
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  // Jours
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  // Mois
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `il y a ${months} mois`;
  }
  
  // Années
  const years = Math.floor(months / 12);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-league-dark py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LOLIFY</h3>
            <p className="text-gray-300">
              Un réseau social pour les passionnés de League of Legends.
              Partagez vos idées, vos stratégies et discutez avec la communauté.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-league-gold">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/articles/create" className="text-gray-300 hover:text-league-gold">
                  Créer un article
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-league-gold">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Ressources externes</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.leagueoflegends.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-league-gold"
                >
                  Site officiel LoL
                </a>
              </li>
              <li>
                <a 
                  href="https://u.gg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-league-gold"
                >
                  U.GG
                </a>
              </li>
              <li>
                <a 
                  href="https://lolesports.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-league-gold"
                >
                  LoL Esports
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Lolify. Tous droits réservés.
            Ce site n&apos;est pas affilié à Riot Games.
          </p>
          <p className="mt-2 text-sm">
            LOLIFY n&apos;est pas associé à Riot Games et ne reflète pas les opinions ou les vues de Riot Games
            ou de toute personne officiellement impliquée dans la production ou la gestion de League of Legends.
            League of Legends et Riot Games sont des marques déposées de Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
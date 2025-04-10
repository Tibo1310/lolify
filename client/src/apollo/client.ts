import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Créer du lien HTTP
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

// Ajout du token d'authentification aux en-têtes
const authLink = setContext((_, { headers }) => {
  // Récupéreration du token depuis le localStorage
  const token = localStorage.getItem('token');

  // Retour des en-têtes mises à jour
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Création du client Apollo
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
  connectToDevTools: true, // Activation des DevTools Apollo
  credentials: 'include'
}); 
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Créer le lien HTTP
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

// Ajouter le token d'authentification aux en-têtes
const authLink = setContext((_, { headers }) => {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');

  // Retourner les en-têtes mis à jour
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Créer le client Apollo
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
  connectToDevTools: true, // Activer les DevTools Apollo
  credentials: 'include'
}); 
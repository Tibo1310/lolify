import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { resolvers } from './resolvers';
import { createContext } from './context/context';

// Charger les variables d'environnement
dotenv.config();

// Lire le schéma GraphQL
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema/schema.graphql'),
  'utf-8'
);

// Configurer Express
const app = express();
const httpServer = http.createServer(app);

// Créer le serveur Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Démarrer le serveur
async function startServer() {
  // Démarrer Apollo Server
  await server.start();

  // Configurer les middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ['http://localhost:4173', 'http://localhost:5173'], // URLs du frontend en dev
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    })
  );

  // Définir la route de base
  app.get('/', (_req, res) => {
    res.send('API GraphQL de Lolify - Utilisez /graphql pour accéder au playground');
  });

  // Démarrer le serveur HTTP
  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, resolve);
  });

  console.log(`🚀 Serveur prêt à l'adresse http://localhost:${PORT}/graphql`);
}

// Gérer les erreurs
startServer().catch((err) => {
  console.error('Erreur lors du démarrage du serveur:', err);
}); 
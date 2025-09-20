import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  // uri: 'https://troves-indexers-graph-api.onrender.com',
  uri: 'https://api.troves.fi/',
  // uri: 'https://indexer-graphql-api.onrender.com/',
  cache: new InMemoryCache(),
});

export default apolloClient;

import { ApolloClient, InMemoryCache } from '@apollo/client';

const ekuboApolloClient = new ApolloClient({
  uri: 'https://troves-indexers-graph-api-ekubo-temp.onrender.com',
  cache: new InMemoryCache(),
});

export default ekuboApolloClient;

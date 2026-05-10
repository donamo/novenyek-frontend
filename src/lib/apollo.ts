import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${apiBaseUrl}/graphql`,
    credentials: "include"
  }),
  cache: new InMemoryCache()
});

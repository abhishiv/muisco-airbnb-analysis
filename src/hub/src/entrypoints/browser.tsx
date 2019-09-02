import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "react-apollo-hooks";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import Layout from "../routes/index";
export function boot() {
  const cache = new InMemoryCache();
  console.log((window as any).__APOLLO_STATE__);
  cache.restore((window as any).__APOLLO_STATE__);
  const client = new ApolloClient({
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: "/graphql",
      credentials: "same-origin"
    }),
    cache
  });

  const rootElement = document.getElementById("root");
  render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ApolloProvider>,
    rootElement
  );
}

(async () => {
  await boot();
})();

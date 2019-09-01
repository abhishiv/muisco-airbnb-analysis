import React from "react";
import { renderToString } from "react-dom/server";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import express from "express";
import { StaticRouter } from "react-router";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMarkupFromTree, ApolloProvider } from "react-apollo-hooks";
import pify from "pify";
import Mustache from "mustache";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

import { Request } from "express";

import Router from "../routes/index";

const router = express.Router();
router.use("/", async (req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: process.env.PUBLIC_URL + "/graphql",
      credentials: "same-origin",
      fetch,
      headers: {
        cookie: req.header("Cookie")
      }
    }),
    cache: new InMemoryCache()
  });

  const context = {};

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Router />
      </StaticRouter>
    </ApolloProvider>
  );
  const content = await getMarkupFromTree({
    tree: App,
    renderFunction: renderToString
  });
  const initialState = client.extract();

  const html = await Html(req, {
    content: content,
    state: initialState
  });

  res.status(200);
  res.send(html);
  res.end();
});

async function Html(
  req: Request,
  { content, state }: { content: string; state: any }
) {
  const template = await pify(fs.readFile)(
    path.join(__dirname, "server.html"),
    "utf8"
  );
  const IS_PROD = process.env.NODE_ENV === "production";
  const DEPLOYMENT_VERSION = process.env.HEROKU_RELEASE_VERSION;
  const domain = `${IS_PROD ? "https" : "http"}://${req.get("host")}`;
  const DOMAIN = domain;
  const APPLICATION_HOST = IS_PROD
    ? domain + `/_static/${DEPLOYMENT_VERSION}`
    : domain + "/_webpack";

  const CDN_BASE = IS_PROD
    ? DOMAIN + `/_static/${DEPLOYMENT_VERSION}`
    : "/_static";
  const BOOT_STRING = `
      console.debug("booting")
    `;

  return Mustache.render(template, {
    APPLICATION_HOST,
    CDN_BASE,
    BOOT_STRING,
    MARKUP: content,
    STATE: JSON.stringify(state).replace(/</g, "\\u003c"),
    IS_PROD,
    DOMAIN,
    DEPLOYMENT_VERSION
  });
}

export default router;

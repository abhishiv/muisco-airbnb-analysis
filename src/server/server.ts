import proxy from "http-proxy-middleware";
import Knex from "knex";
import express from "express";
import compression from "compression";
import siteRouter from "../hub/src/entrypoints/server";
import apiRouter from "./api";
const port = process.env.PORT || 5000;
const server = express();
const { postgraphile } = require("postgraphile");

var pg = Knex({
  client: "pg",
  pool: { min: 0, max: 7 },
  //connection: "postgres://localhost:5432/data"
  connection: process.env.DATABASE_URL || "postgres://localhost:5432/data"
});
server.set("knex", pg);
server.use(compression());
import path from "path";
server.use(
  postgraphile(
    process.env.DATABASE_URL || "postgres://localhost:5432/data",
    "public",
    {
      //watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      graphiqlRoute: "/_graphiql"
    }
  )
);

const assetsDir = process.env.NODE_ENV === "production" ? "build" : "src";
server.use(
  "/_static/",
  express.static(path.join(__dirname, "..", "..", assetsDir), {
    setHeaders: function(header) {
      header.setHeader("Service-Worker-Allowed", "/");
    }
  })
);
server.use(
  "/_static/:version/",
  express.static(path.join(__dirname, "..", "..", assetsDir), {
    setHeaders: function(header) {
      header.setHeader("Service-Worker-Allowed", "/");
    }
  })
);

server.use(
  "/_webpack/",
  proxy({
    target: "http://localhost:7080",
    pathRewrite: { "^/_webpack": "" },
    changeOrigin: true,
    secure: false,
    xfwd: true,
    logLevel: "debug",
    onProxyRes: function(proxyRes, _, res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Service-Worker-Allowed", "/");
      Object.keys(proxyRes.headers).forEach(function(key) {
        res.setHeader(key, proxyRes.headers[key] as any);
      });
    }
  })
);
server.use(
  "/sockjs-node/",
  proxy({
    target: "http://localhost:7080",
    //pathRewrite: { "^/_webpack": "" },
    changeOrigin: true,
    secure: false,
    xfwd: true,
    logLevel: "debug",
    ws: true,
    onProxyRes: function(proxyRes, _, res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Service-Worker-Allowed", "/");
      Object.keys(proxyRes.headers).forEach(function(key) {
        res.setHeader(key, proxyRes.headers[key] as any);
      });
    }
  })
);
server.use(
  "/_data/airbnb/",
  proxy({
    target: "http://data.insideairbnb.com",
    pathRewrite: { "^/_data/airbnb": "" },
    changeOrigin: true,
    secure: false,
    xfwd: true,
    logLevel: "debug",
    ws: true,
    onProxyRes: function(proxyRes, _, res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Service-Worker-Allowed", "/");
      Object.keys(proxyRes.headers).forEach(function(key) {
        res.setHeader(key, proxyRes.headers[key] as any);
      });
    }
  })
);
server.use("/_api", apiRouter);

server.use("/", siteRouter);

if (process.env.NODE_ENV === "production") {
  server.listen(port, function() {
    console.debug("server listening on", port);
  });
} else {
  server.listen(port, function() {
    console.debug("server listening on", port);
  });
}

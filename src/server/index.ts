import proxy from "http-proxy-middleware";

import express from "express";
import compression from "compression";
import siteRouter from "../hub/src/entrypoints/server";
const port = process.env.PORT || 5000;
const server = express();
server.use(compression());

const assetsDir = process.env.NODE_ENV === "production" ? "build" : "src";
server.use(
  "/_static/",
  express.static(path.join(__dirname, "..", "..", assetsDir), {
  })
);
server.use(
  "/_static/:version/",
  express.static(path.join(__dirname, "..", "..", assetsDir), {
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
        res.setHeader(key, proxyRes.headers[key]);
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
        res.setHeader(key, proxyRes.headers[key]);
      });
    }
  })
);

server.use("/", siteRouter);

if (process.env.NODE_ENV === "production") {
  server.listen(port, function() {
    console.debug(
      "server listening on",
      port,
    );
  });
} else {
  server.listen(port, function() {
    console.debug(
      "server listening on",
      port,
    );
  });
}

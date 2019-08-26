import pify from "pify";
import Mustache from "mustache";

import fs from "fs";
import path from "path";

import { Router, Request, Response, NextFunction } from "express";

const IS_PROD = process.env.NODE_ENV === "production";
const DEPLOYMENT_VERSION = process.env.GIT_SHA;

export const kernelRouter: Router = Router();

kernelRouter.use("/", async function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const html = await Html(req, { content: "", state: {} });
  res.status(200);
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");
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

export default kernelRouter;

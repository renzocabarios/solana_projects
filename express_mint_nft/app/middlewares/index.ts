import bodyParser from "body-parser";
import cors from "cors";
import authMiddleware from "./auth.middleware.js";
import { Express } from "express";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(),
  authMiddleware,
];

export const addMiddlewares = (app: Express) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};

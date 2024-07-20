import bodyParser from "body-parser";
import cors from "cors";
import authMiddleware from "./auth.middleware";
import { Express, json, urlencoded } from "express";

export const middlewares = [
  json(),
  urlencoded({ extended: false }),
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Encoding",
      "Accept-Encoding",
    ],
  }),
  authMiddleware,
];

export const addMiddlewares = (app: Express) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};

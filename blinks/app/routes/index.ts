import V1 from "./v1";
import { Express } from "express";

export const addRoutes = (app: Express) => {
  V1.forEach((route) => {
    app.use(`/api/${route.url}`, route.route);
  });
};

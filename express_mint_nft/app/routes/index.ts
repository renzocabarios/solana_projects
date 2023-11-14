import V1 from "./v1";
import { Express } from "express";

export const routes = [
  {
    url: "/api/v1/upload",
    route: V1.uploadRoute,
  },
];

export const addRoutes = (app: Express) => {
  routes.forEach((route) => {
    app.use(route.url, route.route);
  });
};

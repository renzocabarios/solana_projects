import V1 from "./v1";
import { Express } from "express";

export const routes = [
  {
    url: "/api/v1/solana",
    route: V1.solanaRoute,
  },
];

export const addRoutes = (app: Express) => {
  routes.forEach((route) => {
    app.use(route.url, route.route);
  });
};

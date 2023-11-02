import V1 from "./v1";
import { Express } from "express";

export const routes = [
  {
    url: "/api/v1/todos",
    route: V1.todosRoute,
  },
];

export const addRoutes = (app: Express) => {
  routes.forEach((route) => {
    app.use(route.url, route.route);
  });
};

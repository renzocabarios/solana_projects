import "express-async-errors";
import express, { Express } from "express";
import { addRoutes } from "./app/routes/index";
import { addMiddlewares } from "./app/middlewares/index";

const app: Express = express();

addMiddlewares(app);

addRoutes(app);

app.use(function (err: any, req: any, res: any, next: any) {
  res.status(403);
  res.json({
    data: [],
    status: "fail",
    message: err.toString(),
  });
});

export default app;

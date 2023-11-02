import "express-async-errors";
import express, { Express } from "express";
import connectDB from "./app/db";
import ENV from "./app/env/index.js";
import { addRoutes } from "./app/routes/index.js";
import { addMiddlewares } from "./app/middlewares/index.js";

const app: Express = express();

//initialization
const start = () => {
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

  app.listen(ENV.PORT, () => {
    console.log(`Server started on port ${ENV.PORT}`);
  });
};

start();

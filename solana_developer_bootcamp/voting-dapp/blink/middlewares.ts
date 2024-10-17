import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

export function addMiddlewares(app: Express) {
  app.use(express.json());
  app.options(
    "*",
    cors({
      methods: ["GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"],
      allowedHeaders: [
        "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
      ],
      preflightContinue: true,
      optionsSuccessStatus: 204,
    })
  );
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Encoding, Accept-Encoding"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.setHeader("Content-Encoding", "compress");
    res.setHeader("Content-Type", "application/json");
    next();
  });
}

import express from "express";
import { type Request, type Response } from "express";
import healthCheckRouter from "./routes/healthCheck.route.js";
export function buildApp() {
  const app = express();

  app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
  });
  app.use("/health", healthCheckRouter);

  // Посредник для разбора (парсинга) JSON
  app.use(express.json());

  return app;
}

import express from "express";
import { type Request, type Response } from "express";
import healthCheckRouter from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
export function buildApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
  });
  app.use("/health", healthCheckRouter);
  app.use("/user", userRouter);

  // Посредник для разбора (парсинга) JSON

  return app;
}

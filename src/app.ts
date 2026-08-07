import express from "express";
import { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import healthCheckRouter from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
import wardrobeRouter from "./routes/wardrobe.route.js";
import { requireAuth } from "./middlewares/auth.middleware.js";

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
  });
  app.use("/health", healthCheckRouter);
  app.use("/user", userRouter);
  app.use("/wardrobe", requireAuth, wardrobeRouter);

  return app;
}

import express from "express";
import {} from "express";
import healthCheckRouter from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
export function buildApp() {
    const app = express();
    app.get("/", (req, res) => {
        res.send("hello world");
    });
    app.use("/health", healthCheckRouter);
    app.use("/user", userRouter);
    // Посредник для разбора (парсинга) JSON
    app.use(express.json());
    return app;
}
//# sourceMappingURL=app.js.map
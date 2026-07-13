import { Router, type Request, type Response } from "express";

// const Router = require("express").Router();
const router = Router();
router.get("/", async (req: Request, res: Response) => {
  console.log("работает ....что-то, наверное");
  try {
    res.json({
      message: "OK",
      timestamp: Date.now(),
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;

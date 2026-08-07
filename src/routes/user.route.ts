import { Router, type Request, type Response } from "express";
import { prisma } from "~/prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { env } from "~/config/checkEnv.js";
import { requireAuth } from "~/middlewares/auth.middleware.js";

const router = Router();
router.get("/", async (req: Request, res: Response) => {
  console.log("получение всех пользователей");
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  console.log("выход пользователя");
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// requireAuth уже проверил токен и положил req.userId -
// тут просто достаём пользователя по нему, без повторной проверки JWT вручную.
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  console.log("/me");
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      login: user.login,
      name: user.name,
      phone: user.phone,
      prophileImageLink: user.imgLink,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/exist", async (req: Request, res: Response) => {
  // либо email, либо login
  console.log("проверка существования пользователя");
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email, login: req.body.login },
    });
    res.json(!!user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/create", async (req: Request, res: Response) => {
  console.log("создание нового пользователя");

  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const user = await prisma.user.create({
      data: { ...req.body, password: hash },
    });
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.json({
      login: user.login,
      name: user.name,
      phone: user.phone,
      prophileImageLink: user.imgLink,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/auth", async (req: Request, res: Response) => {
  console.log("аутентификация пользователя");
  try {
    const user = await prisma.user.findUnique({
      where: { login: req.body.login },
    });
    const isValid =
      user && (await bcrypt.compare(req.body.password, user.password));
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true });

    res.json({
      login: user.login,
      name: user.name,
      phone: user.phone,
      prophileImageLink: user.imgLink,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;

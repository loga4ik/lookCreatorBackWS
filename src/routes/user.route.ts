import { Router, type Request, type Response } from "express";
import { prisma } from "~/prisma/client.js";
import bcrypt from "bcrypt";

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

router.post("/create", async (req: Request, res: Response) => {
  console.log("создание нового пользователя");

  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const user = await prisma.user.create({
      data: { ...req.body, password: hash },
    });
    console.log(user);
    res.json(user);
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

router.post("/auth", async (req: Request, res: Response) => {
  console.log("аутентификация пользователя");
  console.log(req.body);
  try {
    const user = await prisma.user.findUnique({
      where: { login: req.body.login },
    });
    const isValid =
      user && (await bcrypt.compare(req.body.password, user.password));
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;

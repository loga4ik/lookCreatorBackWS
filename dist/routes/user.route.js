import { Router } from "express";
import { prisma } from "~/prisma/client.js";
import bcrypt from "bcrypt";
const router = Router();
router.get("/", async (req, res) => {
    console.log("получение всех пользователей");
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post("/create", async (req, res) => {
    console.log("создание нового пользователя");
    const hash = await bcrypt.hash(req.body.password, 12);
    try {
        const user = await prisma.user.create({
            data: { ...req.body, password: hash },
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
router.post("/auth", async (req, res) => {
    console.log("аутентификация пользователя");
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email },
        });
        const isValid = user && (await bcrypt.compare(req.body.password, user.password));
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
export default router;
//# sourceMappingURL=user.route.js.map
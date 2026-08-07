import { Router, type Request, type Response } from "express";
import { prisma } from "~/prisma/client.js";

// Смонтирован в app.ts как app.use("/wardrobe", requireAuth, wardrobeRouter) -
// requireAuth уже отработал раньше, req.userId к этому моменту гарантированно есть.
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  console.log("список вещей гардероба");
  try {
    const items = await prisma.wardrobeItem.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  console.log("добавление вещи в гардероб");
  try {
    const { imageUrl, category, color, name } = req.body;
    if (!imageUrl || !category) {
      return res
        .status(400)
        .json({ message: "imageUrl и category обязательны" });
    }

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: req.userId!,
        imageUrl,
        category,
        color,
        name,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  console.log("удаление вещи из гардероба");
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некорректный id" });
    }

    const item = await prisma.wardrobeItem.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ message: "Вещь не найдена" });
    }
    if (item.userId !== req.userId) {
      // чужую вещь удалить нельзя, даже если знаешь её id
      return res.status(403).json({ message: "Нет доступа" });
    }

    await prisma.wardrobeItem.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;

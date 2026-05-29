import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchema.js";

const router = Router();

// GET /transactions - lista todas com a categoria expandida
router.get("/", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (e) {
    next(e);
  }
});

// POST /transactions - cria uma nova transação
router.post("/", async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId: req.user.id,
      },
      include: { category: true },
    });
    res.status(201).json(transaction);
  } catch (e) {
    next(e);
  }
});

// PUT /transactions/:id
router.put("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    const data = updateTransactionSchema.parse(req.body);
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    });
    res.json(transaction);
  } catch (e) {
    next(e);
  }
});

// DELETE /transactions/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;

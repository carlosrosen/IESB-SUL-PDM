import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
      },
    });
    return res.json(user);
  } catch (e) {
    next(e);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user.id);
    return res.json({ 
      token,
      user: { id: user.id, name: user.name }
    });
  } catch (e) {
    next(e);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!userExists) {
      return res.status(400).json({
        error: "Usuário ou senha inválidos",
      });
    }
    const validPassword = await verifyPassword(userExists.password, password);
    if (!validPassword) {
      return res.status(400).json({
        error: "Usuário ou senha inválidos",
      });
    }
    const token = generateToken(userExists.id);
    return res.json({
      token,
      user: { id: userExists.id, name: userExists.name }
    });
  } catch (e) {
    next(e);
  }
});

export default router;

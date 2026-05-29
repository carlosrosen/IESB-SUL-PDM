import { verifyToken } from "../utils/jwt.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "Token não enviado",
      });
    }
    const [, token] = authHeader.split(" ");
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      error: "Token inválido",
    });
  }
}

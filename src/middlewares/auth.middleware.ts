import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwtSecret from "~/config/checkEnv.js";


if (!jwtSecret) {
  // Падаем сразу при старте сервера, а не в рантайме на первом запросе —
  // так забытый .env заметят сразу, а не через день дебага.
  throw new Error("JWT_SECRET не задан в .env");
}


/**
 * Проверяет JWT из httpOnly-cookie "token" на каждом запросе к защищённым роутам.
 * Валидный токен -> кладёт req.userId и пропускает дальше.
 * Токена нет или он невалиден/истёк -> 401, дальше запрос не идёт.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ message: "Не авторизован" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    if (typeof payload === "string" || typeof payload.id !== "number") {
      res.status(401).json({ message: "Невалидный или истёкший токен" });
      return;
    }
    req.userId = payload.id;
    next();
  } catch (err) {
    // Сюда попадают и просроченные (TokenExpiredError), и подделанные
    // (JsonWebTokenError) токены — пользователю оба случая надо просто перелогиниться.
    res.status(401).json({ message: "Невалидный или истёкший токен" });
  }
}

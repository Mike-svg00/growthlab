import type { Request, Response, NextFunction } from "express";
import { validateInitData, type TelegramUser } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const initData = req.headers["x-init-data"] as string | undefined;
  const user = validateInitData(initData || "");
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: invalid initData" });
  }
  req.telegramUser = user;
  next();
}

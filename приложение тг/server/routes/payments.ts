import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userService from "../services/userService.js";
import * as paymentService from "../services/paymentService.js";

const router = Router();

router.get("/battle-pass", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const status = await paymentService.getBattlePassStatus(user.id);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

router.post("/battle-pass", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const result = await paymentService.purchaseBattlePass(user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/preview", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const price = parseInt(String(req.query.price || "0"), 10);
    const profile = await userService.getUserProfile(user.id);
    const preview = paymentService.calculatePayout(price, profile.hasBattlePass);
    res.json(preview);
  } catch (err) {
    next(err);
  }
});

export default router;

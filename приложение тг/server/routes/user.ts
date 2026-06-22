import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userService from "../services/userService.js";

const router = Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const profile = await userService.getUserProfile(user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

export default router;

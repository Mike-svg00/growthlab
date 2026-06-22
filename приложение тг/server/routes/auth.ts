import { Router } from "express";
import { validateInitData } from "../middleware/auth.js";
import * as userService from "../services/userService.js";

const router = Router();

router.post("/validate", async (req, res, next) => {
  try {
    const { initData, startParam } = req.body;
    const tgUser = validateInitData(initData || "");
    if (!tgUser) return res.status(401).json({ error: "Invalid initData" });

    const user = await userService.getOrCreateUser(tgUser.id, tgUser.username ?? null, startParam);
    res.json({ user, telegramUser: tgUser });
  } catch (err) {
    next(err);
  }
});

export default router;

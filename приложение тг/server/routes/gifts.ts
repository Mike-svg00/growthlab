import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userService from "../services/userService.js";
import * as giftService from "../services/giftService.js";
import * as auctionService from "../services/auctionService.js";

const router = Router();

router.get("/inventory", authMiddleware, (_req, res) => {
  res.json(giftService.DEMO_INVENTORY);
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const gifts = await giftService.getMyGifts(user.id);
    res.json(gifts);
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const { giftName, giftType, askingPrice } = req.body;
    if (!giftName || !askingPrice) {
      return res.status(400).json({ error: "giftName and askingPrice required" });
    }

    const gift = await giftService.listGift(user.id, giftName, giftType || "gift", askingPrice);
    const auction = await auctionService.startReverseAuction(gift.id, user.id);
    res.json({ gift, auction });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const ok = await giftService.cancelListing(parseInt(req.params.id, 10), user.id);
    if (!ok) return res.status(404).json({ error: "Gift not found or cannot cancel" });
    res.json({ status: "cancelled" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const gift = await giftService.getGift(parseInt(req.params.id, 10));
    if (!gift) return res.status(404).json({ error: "Gift not found" });
    res.json(gift);
  } catch (err) {
    next(err);
  }
});

export default router;

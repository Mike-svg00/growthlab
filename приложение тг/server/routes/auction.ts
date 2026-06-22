import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userService from "../services/userService.js";
import * as auctionService from "../services/auctionService.js";

const router = Router();

router.get("/offers", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const offers = await auctionService.getAllPendingOffers(user.id);
    res.json(offers);
  } catch (err) {
    next(err);
  }
});

router.get("/offers/:giftId", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const offers = await auctionService.getOffersForGift(
      parseInt(req.params.giftId, 10),
      user.id
    );
    res.json(offers);
  } catch (err) {
    next(err);
  }
});

router.post("/start", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const { giftId } = req.body;
    const result = await auctionService.startReverseAuction(giftId, user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/accept", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const { offerId } = req.body;
    const result = await auctionService.acceptOffer(offerId, user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/counter", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const { giftId, offeredPrice } = req.body;
    const offer = await auctionService.submitCounterOffer(giftId, user.id, offeredPrice);
    res.json(offer);
  } catch (err) {
    next(err);
  }
});

export default router;

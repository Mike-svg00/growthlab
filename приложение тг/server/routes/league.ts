import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userService from "../services/userService.js";
import * as leagueService from "../services/leagueService.js";

const router = Router();

router.get("/", authMiddleware, async (_req, res, next) => {
  try {
    const league = await leagueService.getLeague();
    res.json(league);
  } catch (err) {
    next(err);
  }
});

router.get("/rank", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const rank = await leagueService.getLeagueRank(user.id);
    res.json(rank);
  } catch (err) {
    next(err);
  }
});

router.get("/friends", authMiddleware, async (req, res, next) => {
  try {
    const user = await userService.getOrCreateUser(
      req.telegramUser!.id,
      req.telegramUser!.username ?? null
    );
    const friends = await leagueService.getFriendsInLeague(user.id);
    res.json(friends);
  } catch (err) {
    next(err);
  }
});

export default router;

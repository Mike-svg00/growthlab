import * as UserModel from "../models/User.js";
import { query } from "../db/connection.js";
import { env } from "../config/env.js";

export async function purchaseBattlePass(userId: number) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const price = env.BATTLE_PASS_PRICE;
  if (user.balance_stars < price) {
    throw new Error(`Insufficient Stars. Need ${price}, have ${user.balance_stars}`);
  }

  await UserModel.updateBalance(userId, -price);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await UserModel.setBattlePass(userId, expiresAt);

  await query("INSERT INTO battle_passes (user_id, purchased_at, expires_at) VALUES ($1, NOW(), $2)", [
    userId,
    expiresAt,
  ]);

  return {
    status: "battle_pass_activated",
    expiresAt,
    price,
    benefits: {
      commissionRate: env.BATTLE_PASS_COMMISSION_RATE,
      listingsPerDay: 5,
      priorityMatching: true,
    },
  };
}

export async function getBattlePassStatus(userId: number) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const active = UserModel.hasBattlePass(user);
  return {
    active,
    expiresAt: user.battle_pass_until,
    price: env.BATTLE_PASS_PRICE,
    commissionRate: active ? env.BATTLE_PASS_COMMISSION_RATE : env.COMMISSION_RATE,
    standardCommissionRate: env.COMMISSION_RATE,
  };
}

export function calculatePayout(price: number, hasBattlePass: boolean) {
  const rate = hasBattlePass ? env.BATTLE_PASS_COMMISSION_RATE : env.COMMISSION_RATE;
  const commission = Math.floor((price * rate) / 100);
  return { payout: price - commission, commission, rate };
}

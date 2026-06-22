import * as UserModel from "../models/User.js";
import { query } from "../db/connection.js";

export async function getOrCreateUser(
  telegramId: number,
  username: string | null,
  startParam?: string
) {
  let user = await UserModel.findByTelegramId(telegramId);
  if (!user) {
    let referredBy: number | undefined;
    if (startParam?.startsWith("ref_")) {
      const referrerTelegramId = parseInt(startParam.replace("ref_", ""), 10);
      const referrer = await UserModel.findByTelegramId(referrerTelegramId);
      if (referrer) {
        referredBy = referrer.id;
        const refCount = await query(
          "SELECT COUNT(*) as count FROM referrals WHERE referrer_id = $1",
          [referrer.id]
        );
        if (parseInt(String(refCount.rows[0]?.count ?? 0), 10) < 10) {
          await query(
            "UPDATE users SET free_listings = free_listings + 1 WHERE id = $1",
            [referrer.id]
          );
        }
      }
    }
    user = await UserModel.createUser(telegramId, username, referredBy);
    if (referredBy) {
      await query("INSERT INTO referrals (referrer_id, referred_id) VALUES ($1, $2)", [
        referredBy,
        user.id,
      ]);
    }
  }
  return user;
}

export async function getUserProfile(userId: number) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");
  const hasBattlePass = UserModel.hasBattlePass(user);
  return {
    ...user,
    hasBattlePass,
    commissionRate: hasBattlePass ? 1.5 : 2.1,
  };
}

export function getInviteLink(telegramId: number, botUsername: string) {
  return `https://t.me/${botUsername}?start=ref_${telegramId}`;
}

import { query } from "../db/connection.js";

export interface UserRow {
  id: number;
  telegram_id: number;
  username: string | null;
  rating: number;
  total_trades: number;
  balance_stars: number;
  battle_pass_until: Date | null;
  free_listings: number;
  referred_by: number | null;
  created_at: Date;
}

export async function findByTelegramId(telegramId: number): Promise<UserRow | null> {
  const result = await query<UserRow>("SELECT * FROM users WHERE telegram_id = $1", [telegramId]);
  return result.rows[0] ?? null;
}

export async function findById(id: number): Promise<UserRow | null> {
  const result = await query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function createUser(
  telegramId: number,
  username: string | null,
  referredBy?: number
): Promise<UserRow> {
  const result = await query<UserRow>(
    "INSERT INTO users (telegram_id, username, referred_by) VALUES ($1, $2, $3) RETURNING *",
    [telegramId, username, referredBy ?? null]
  );
  return result.rows[0];
}

export async function updateBalance(userId: number, delta: number): Promise<void> {
  if (delta >= 0) {
    await query("UPDATE users SET balance_stars = balance_stars + $1 WHERE id = $2", [delta, userId]);
  } else {
    await query("UPDATE users SET balance_stars = balance_stars - $1 WHERE id = $2", [-delta, userId]);
  }
}

export async function incrementTrades(userId: number): Promise<void> {
  await query("UPDATE users SET total_trades = total_trades + 1 WHERE id = $1", [userId]);
}

export async function setBattlePass(userId: number, until: Date): Promise<void> {
  await query("UPDATE users SET battle_pass_until = $1 WHERE id = $2", [until, userId]);
}

export function hasBattlePass(user: UserRow): boolean {
  if (!user.battle_pass_until) return false;
  return new Date(user.battle_pass_until) > new Date();
}

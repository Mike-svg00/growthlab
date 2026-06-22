import { query } from "../db/connection.js";

export interface GiftRow {
  id: number;
  user_id: number;
  gift_name: string;
  gift_type: string;
  asking_price: number;
  status: string;
  expires_at: Date | null;
  created_at: Date;
}

export async function createGift(
  userId: number,
  giftName: string,
  giftType: string,
  askingPrice: number,
  expiresAt: Date
): Promise<GiftRow> {
  const result = await query<GiftRow>(
    `INSERT INTO gifts (user_id, gift_name, gift_type, asking_price, expires_at)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, giftName, giftType, askingPrice, expiresAt]
  );
  return result.rows[0];
}

export async function getGift(id: number): Promise<GiftRow | null> {
  const result = await query<GiftRow>("SELECT * FROM gifts WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function getGiftsByUser(userId: number): Promise<GiftRow[]> {
  const result = await query<GiftRow>(
    "SELECT * FROM gifts WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function updateGiftStatus(id: number, status: string): Promise<void> {
  await query("UPDATE gifts SET status = $1 WHERE id = $2", [status, id]);
}

export async function cancelGift(id: number, userId: number): Promise<boolean> {
  const gift = await getGift(id);
  if (!gift || gift.user_id !== userId) return false;
  if (gift.status === "sold") return false;
  await updateGiftStatus(id, "cancelled");
  return true;
}

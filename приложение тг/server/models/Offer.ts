import { query } from "../db/connection.js";

export interface OfferRow {
  id: number;
  gift_id: number;
  buyer_id: number;
  offered_price: number;
  buyer_rating: number;
  status: string;
  created_at: Date;
}

export interface OfferWithBuyer extends OfferRow {
  username: string | null;
  total_trades: number;
}

export async function createOffer(
  giftId: number,
  buyerId: number,
  offeredPrice: number,
  buyerRating: number
): Promise<OfferRow> {
  const result = await query<OfferRow>(
    `INSERT INTO offers (gift_id, buyer_id, offered_price, buyer_rating)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [giftId, buyerId, offeredPrice, buyerRating]
  );
  return result.rows[0];
}

export async function getOffer(id: number): Promise<OfferRow | null> {
  const result = await query<OfferRow>("SELECT * FROM offers WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function getPendingOffersForGift(giftId: number): Promise<OfferWithBuyer[]> {
  const result = await query<OfferWithBuyer>(
    `SELECT o.*, u.username, u.total_trades
     FROM offers o
     JOIN users u ON u.id = o.buyer_id
     WHERE o.gift_id = $1 AND o.status = 'pending'
     ORDER BY o.offered_price DESC, o.buyer_rating DESC
     LIMIT 10`,
    [giftId]
  );
  return result.rows;
}

export async function getPendingOffersForSeller(userId: number) {
  const result = await query(
    `SELECT o.*, u.username, g.gift_name, u.total_trades
     FROM offers o
     JOIN users u ON u.id = o.buyer_id
     JOIN gifts g ON g.id = o.gift_id
     WHERE g.user_id = $1 AND o.status = 'pending'`,
    [userId]
  );
  return result.rows;
}

export async function acceptOffer(offerId: number): Promise<void> {
  const offer = await getOffer(offerId);
  if (!offer) return;
  await query("UPDATE offers SET status = 'rejected' WHERE gift_id = $1 AND id != $2", [
    offer.gift_id,
    offerId,
  ]);
  await query("UPDATE offers SET status = 'accepted' WHERE id = $1", [offerId]);
}

export async function getTopRecentBuyers(limit = 10) {
  const result = await query(
    `SELECT DISTINCT buyer_id, COUNT(*) as purchase_count, AVG(buyer_rating) as avg_rating
     FROM offers
     WHERE status = 'accepted'
       AND created_at > NOW() - INTERVAL '7 days'
     GROUP BY buyer_id
     ORDER BY purchase_count DESC, avg_rating DESC
     LIMIT $1`,
    [limit]
  );
  if (result.rows.length === 0) {
    const fallback = await query(
      `SELECT id as buyer_id, total_trades as purchase_count, rating as avg_rating
       FROM users ORDER BY total_trades DESC LIMIT $1`,
      [limit]
    );
    return fallback.rows;
  }
  return result.rows;
}

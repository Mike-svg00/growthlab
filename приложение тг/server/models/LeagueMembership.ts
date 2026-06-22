import { query } from "../db/connection.js";
import { getWeekStart } from "../db/memory.js";

export interface LeagueEntry {
  user_id: number;
  username: string | null;
  rank: number;
  sales_this_week: number;
  rating_avg: number;
}

export async function getLeagueForWeek(weekStart?: string): Promise<LeagueEntry[]> {
  const week = weekStart || getWeekStart();
  const result = await query(
    `SELECT lm.*, u.username
     FROM league_memberships lm
     JOIN users u ON u.id = lm.user_id
     WHERE lm.week_start = $1
     ORDER BY lm.rank ASC`,
    [week]
  );
  return result.rows as LeagueEntry[];
}

export async function getUserRank(userId: number, weekStart?: string): Promise<LeagueEntry | null> {
  const week = weekStart || getWeekStart();
  const result = await query(
    `SELECT lm.*, u.username
     FROM league_memberships lm
     JOIN users u ON u.id = lm.user_id
     WHERE lm.week_start = $1 AND lm.user_id = $2`,
    [week, userId]
  );
  return (result.rows[0] as LeagueEntry) ?? null;
}

export async function incrementSales(userId: number): Promise<void> {
  const week = getWeekStart();
  await query(
    `INSERT INTO league_memberships (user_id, week_start, rank, sales_this_week, rating_avg)
     VALUES ($1, $2, 999, 1, 5.0)
     ON CONFLICT (user_id, week_start) DO UPDATE SET sales_this_week = league_memberships.sales_this_week + 1`,
    [userId, week]
  );
}

import { getLeagueForWeek, getUserRank } from "../models/LeagueMembership.js";
import { getWeekStart } from "../db/memory.js";

export async function getLeague() {
  const weekStart = getWeekStart();
  const endDate = new Date(weekStart);
  endDate.setUTCDate(endDate.getUTCDate() + 6);

  const entries = await getLeagueForWeek(weekStart);
  return {
    weekStart,
    weekEnd: endDate.toISOString().split("T")[0],
    totalPlayers: entries.length || 500,
    entries,
  };
}

export async function getLeagueRank(userId: number) {
  const rank = await getUserRank(userId);
  const league = await getLeague();
  return {
    rank: rank?.rank ?? null,
    salesThisWeek: rank?.sales_this_week ?? 0,
    rating: rank?.rating_avg ?? 5.0,
    totalPlayers: league.totalPlayers,
    weekStart: league.weekStart,
    weekEnd: league.weekEnd,
  };
}

export async function getFriendsInLeague(userId: number, limit = 4) {
  const league = await getLeague();
  const userEntry = league.entries.find((e) => e.user_id === userId);
  if (!userEntry) return league.entries.slice(0, limit);

  const idx = league.entries.findIndex((e) => e.user_id === userId);
  const start = Math.max(0, idx - 1);
  return league.entries.slice(start, start + limit);
}

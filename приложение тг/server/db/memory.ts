/**
 * In-memory DB fallback for local dev without PostgreSQL.
 * Implements a subset of SQL used by the app.
 */

interface User {
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

interface Gift {
  id: number;
  user_id: number;
  gift_name: string;
  gift_type: string;
  asking_price: number;
  status: string;
  expires_at: Date | null;
  created_at: Date;
}

interface Offer {
  id: number;
  gift_id: number;
  buyer_id: number;
  offered_price: number;
  buyer_rating: number;
  status: string;
  created_at: Date;
}

interface LeagueMembership {
  id: number;
  user_id: number;
  week_start: string;
  rank: number;
  sales_this_week: number;
  rating_avg: number;
  created_at: Date;
}

class MemoryDatabase {
  users: User[] = [];
  gifts: Gift[] = [];
  offers: Offer[] = [];
  league_memberships: LeagueMembership[] = [];
  battle_passes: { id: number; user_id: number; purchased_at: Date; expires_at: Date }[] = [];
  referrals: { id: number; referrer_id: number; referred_id: number; created_at: Date }[] = [];
  private seq = { users: 0, gifts: 0, offers: 0, league: 0, bp: 0, ref: 0 };

  seed() {
    if (this.users.length > 0) return;

    const demoUsers = [
      { telegram_id: 100001, username: "alice", rating: 4.9, total_trades: 548, balance_stars: 5000 },
      { telegram_id: 100002, username: "bob", rating: 4.8, total_trades: 342, balance_stars: 3200 },
      { telegram_id: 100003, username: "trader_pro", rating: 4.9, total_trades: 548, balance_stars: 8000 },
      { telegram_id: 100004, username: "casual_buyer", rating: 4.2, total_trades: 95, balance_stars: 1500 },
      { telegram_id: 100005, username: "newbie", rating: 5.0, total_trades: 3, balance_stars: 500 },
      { telegram_id: 100006, username: "legend", rating: 4.9, total_trades: 1200, balance_stars: 15000 },
      { telegram_id: 100007, username: "beast", rating: 4.8, total_trades: 890, balance_stars: 9000 },
      { telegram_id: 100008, username: "pro", rating: 4.7, total_trades: 650, balance_stars: 7000 },
    ];

    for (const u of demoUsers) {
      this.seq.users++;
      this.users.push({
        id: this.seq.users,
        telegram_id: u.telegram_id,
        username: u.username,
        rating: u.rating,
        total_trades: u.total_trades,
        balance_stars: u.balance_stars,
        battle_pass_until: null,
        free_listings: 1,
        referred_by: null,
        created_at: new Date(),
      });
    }

    const weekStart = getWeekStart();
    const leagueData = [
      { user_id: 6, sales: 47, rating: 4.9 },
      { user_id: 7, sales: 42, rating: 4.8 },
      { user_id: 8, sales: 39, rating: 4.7 },
      { user_id: 1, sales: 18, rating: 4.9 },
      { user_id: 2, sales: 15, rating: 4.8 },
      { user_id: 3, sales: 12, rating: 4.9 },
    ];

    leagueData.forEach((l, i) => {
      this.seq.league++;
      this.league_memberships.push({
        id: this.seq.league,
        user_id: l.user_id,
        week_start: weekStart,
        rank: i + 1,
        sales_this_week: l.sales,
        rating_avg: l.rating,
        created_at: new Date(),
      });
    });
  }

  async query(text: string, params: unknown[] = []) {
    const sql = text.trim().toLowerCase();

    // INSERT users
    if (sql.includes("insert into users")) {
      this.seq.users++;
      const user: User = {
        id: this.seq.users,
        telegram_id: params[0] as number,
        username: params[1] as string,
        rating: 5.0,
        total_trades: 0,
        balance_stars: 1000,
        battle_pass_until: null,
        free_listings: 1,
        referred_by: params[2] as number | null ?? null,
        created_at: new Date(),
      };
      this.users.push(user);
      return { rows: [user], rowCount: 1 };
    }

    // SELECT user by telegram_id
    if (sql.includes("from users") && sql.includes("telegram_id")) {
      const tid = params[0] as number;
      const user = this.users.find((u) => u.telegram_id === tid);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // SELECT user by id
    if (sql.includes("from users where id")) {
      const id = params[0] as number;
      const user = this.users.find((u) => u.id === id);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // UPDATE users
    if (sql.startsWith("update users set")) {
      const id = params[params.length - 1] as number;
      const user = this.users.find((u) => u.id === id);
      if (user) {
        if (sql.includes("balance_stars = balance_stars +")) {
          user.balance_stars += params[0] as number;
        } else if (sql.includes("balance_stars = balance_stars -")) {
          user.balance_stars -= params[0] as number;
        } else if (sql.includes("battle_pass_until")) {
          user.battle_pass_until = params[0] as Date;
        } else if (sql.includes("total_trades = total_trades +")) {
          user.total_trades += 1;
        } else if (sql.includes("free_listings")) {
          user.free_listings = params[0] as number;
        }
      }
      return { rows: user ? [user] : [], rowCount: 1 };
    }

    // INSERT gifts
    if (sql.includes("insert into gifts")) {
      this.seq.gifts++;
      const gift: Gift = {
        id: this.seq.gifts,
        user_id: params[0] as number,
        gift_name: params[1] as string,
        gift_type: params[2] as string,
        asking_price: params[3] as number,
        status: "listed",
        expires_at: params[4] as Date,
        created_at: new Date(),
      };
      this.gifts.push(gift);
      return { rows: [gift], rowCount: 1 };
    }

    // SELECT gifts
    if (sql.includes("from gifts")) {
      if (sql.includes("where id =")) {
        const gift = this.gifts.find((g) => g.id === (params[0] as number));
        return { rows: gift ? [gift] : [], rowCount: gift ? 1 : 0 };
      }
      if (sql.includes("where user_id =")) {
        const rows = this.gifts.filter((g) => g.user_id === (params[0] as number));
        return { rows, rowCount: rows.length };
      }
      if (sql.includes("status = 'listed'") || sql.includes("status in")) {
        const rows = this.gifts.filter((g) => g.status === "listed" || g.status === "auction_active");
        return { rows, rowCount: rows.length };
      }
    }

    // UPDATE gifts
    if (sql.startsWith("update gifts set")) {
      const id = params[params.length - 1] as number;
      const gift = this.gifts.find((g) => g.id === id);
      if (gift) {
        if (sql.includes("status = 'sold'")) gift.status = "sold";
        else if (sql.includes("status = 'cancelled'")) gift.status = "cancelled";
        else if (sql.includes("auction_active")) gift.status = "auction_active";
        else if (params[0]) gift.status = params[0] as string;
      }
      return { rows: gift ? [gift] : [], rowCount: 1 };
    }

    // INSERT offers
    if (sql.includes("insert into offers")) {
      this.seq.offers++;
      const offer: Offer = {
        id: this.seq.offers,
        gift_id: params[0] as number,
        buyer_id: params[1] as number,
        offered_price: params[2] as number,
        buyer_rating: params[3] as number,
        status: "pending",
        created_at: new Date(),
      };
      this.offers.push(offer);
      return { rows: [offer], rowCount: 1 };
    }

    // SELECT offers
    if (sql.includes("from offers")) {
      if (sql.includes("where gift_id =") && sql.includes("status = 'pending'")) {
        const rows = this.offers
          .filter((o) => o.gift_id === (params[0] as number) && o.status === "pending")
          .sort((a, b) => b.offered_price - a.offered_price || b.buyer_rating - a.buyer_rating);
        return { rows, rowCount: rows.length };
      }
      if (sql.includes("where id =")) {
        const offer = this.offers.find((o) => o.id === (params[0] as number));
        return { rows: offer ? [offer] : [], rowCount: offer ? 1 : 0 };
      }
      if (sql.includes("buyer_id") && sql.includes("status = 'accepted'")) {
        const buyers = new Map<number, { count: number; rating: number }>();
        this.offers
          .filter((o) => o.status === "accepted" && o.created_at > new Date(Date.now() - 7 * 86400000))
          .forEach((o) => {
            const b = buyers.get(o.buyer_id) || { count: 0, rating: 0 };
            b.count++;
            const user = this.users.find((u) => u.id === o.buyer_id);
            b.rating = user?.rating ?? 5;
            buyers.set(o.buyer_id, b);
          });
        const rows = Array.from(buyers.entries())
          .map(([buyer_id, v]) => ({ buyer_id, purchase_count: v.count, avg_rating: v.rating }))
          .sort((a, b) => b.purchase_count - a.purchase_count)
          .slice(0, 10);
        return { rows, rowCount: rows.length };
      }
      if (sql.includes("join users") && sql.includes("join gifts")) {
        const userId = params[0] as number;
        const rows = this.offers
          .filter((o) => {
            const gift = this.gifts.find((g) => g.id === o.gift_id);
            return gift && gift.user_id === userId && o.status === "pending";
          })
          .map((o) => {
            const buyer = this.users.find((u) => u.id === o.buyer_id);
            const gift = this.gifts.find((g) => g.id === o.gift_id);
            return { ...o, username: buyer?.username, gift_name: gift?.gift_name, total_trades: buyer?.total_trades };
          });
        return { rows, rowCount: rows.length };
      }
    }

    // UPDATE offers
    if (sql.startsWith("update offers set")) {
      if (sql.includes("status = 'rejected'") && sql.includes("gift_id")) {
        this.offers
          .filter((o) => o.gift_id === (params[0] as number) && o.id !== (params[1] as number))
          .forEach((o) => (o.status = "rejected"));
      } else if (sql.includes("status = 'accepted'")) {
        const offer = this.offers.find((o) => o.id === (params[0] as number));
        if (offer) offer.status = "accepted";
      }
      return { rows: [], rowCount: 1 };
    }

    // League
    if (sql.includes("from league_memberships")) {
      const weekStart = params[0] as string;
      const rows = this.league_memberships
        .filter((l) => l.week_start === weekStart)
        .sort((a, b) => a.rank - b.rank)
        .map((l) => {
          const user = this.users.find((u) => u.id === l.user_id);
          return { ...l, username: user?.username };
        });
      return { rows, rowCount: rows.length };
    }

    if (sql.includes("insert into league_memberships")) {
      return { rows: [], rowCount: 1 };
    }

    // Battle pass
    if (sql.includes("insert into battle_passes")) {
      this.seq.bp++;
      this.battle_passes.push({
        id: this.seq.bp,
        user_id: params[0] as number,
        purchased_at: new Date(),
        expires_at: params[1] as Date,
      });
      return { rows: [], rowCount: 1 };
    }

    // Referrals count
    if (sql.includes("from referrals") && sql.includes("referrer_id")) {
      const count = this.referrals.filter((r) => r.referrer_id === (params[0] as number)).length;
      return { rows: [{ count: String(count) }], rowCount: 1 };
    }

    if (sql.includes("insert into referrals")) {
      this.seq.ref++;
      this.referrals.push({
        id: this.seq.ref,
        referrer_id: params[0] as number,
        referred_id: params[1] as number,
        created_at: new Date(),
      });
      return { rows: [], rowCount: 1 };
    }

    // Generic user list for buyers
    if (sql.includes("select distinct") && sql.includes("limit 10")) {
      const rows = this.users.slice(0, 10).map((u) => ({
        buyer_id: u.id,
        purchase_count: u.total_trades,
        avg_rating: u.rating,
      }));
      return { rows, rowCount: rows.length };
    }

    console.warn("MemoryDB: unhandled query:", text.substring(0, 80));
    return { rows: [], rowCount: 0 };
  }
}

export function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

export const memoryDb = new MemoryDatabase();

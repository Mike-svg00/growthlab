-- FLUX Database Schema
-- Run: psql $DATABASE_URL -f server/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  rating FLOAT DEFAULT 5.0,
  total_trades INT DEFAULT 0,
  balance_stars INT DEFAULT 1000,
  battle_pass_until TIMESTAMP,
  free_listings INT DEFAULT 1,
  referred_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gifts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  gift_name VARCHAR(255),
  gift_type VARCHAR(50),
  asking_price INT,
  status VARCHAR(50) DEFAULT 'listed',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  gift_id INT REFERENCES gifts(id),
  buyer_id INT REFERENCES users(id),
  offered_price INT,
  buyer_rating FLOAT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS league_memberships (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  week_start DATE,
  rank INT,
  sales_this_week INT DEFAULT 0,
  rating_avg FLOAT DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE TABLE IF NOT EXISTS battle_passes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  purchased_at TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INT REFERENCES users(id),
  referred_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referred_id)
);

CREATE INDEX IF NOT EXISTS idx_gifts_user_id ON gifts(user_id);
CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);
CREATE INDEX IF NOT EXISTS idx_offers_gift_id ON offers(gift_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_league_week ON league_memberships(week_start, rank);

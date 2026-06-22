import dotenv from "dotenv";

dotenv.config();

export const env = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "",
  WEBAPP_URL: process.env.WEBAPP_URL || "http://localhost:5173",
  BOT_USERNAME: process.env.BOT_USERNAME || "flux_bot",
  PORT: parseInt(process.env.PORT || "3001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  COMMISSION_RATE: parseFloat(process.env.COMMISSION_RATE || "2.1"),
  BATTLE_PASS_COMMISSION_RATE: parseFloat(process.env.BATTLE_PASS_COMMISSION_RATE || "1.5"),
  BATTLE_PASS_PRICE: parseInt(process.env.BATTLE_PASS_PRICE || "49", 10),
  USE_MEMORY_DB: !process.env.DATABASE_URL,
};

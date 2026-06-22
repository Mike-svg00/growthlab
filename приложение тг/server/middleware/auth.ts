import crypto from "crypto";
import { env } from "../config/env.js";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function validateInitData(initData: string): TelegramUser | null {
  if (!initData) {
    if (env.NODE_ENV === "development") {
      return { id: 999999, first_name: "Dev", username: "dev_user" };
    }
    return null;
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash || !env.TELEGRAM_TOKEN) return null;

    params.delete("hash");
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(env.TELEGRAM_TOKEN).digest();
    const computed = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (computed !== hash) {
      if (env.NODE_ENV === "development") {
        const userStr = params.get("user");
        if (userStr) return JSON.parse(userStr);
      }
      return null;
    }

    const userStr = params.get("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

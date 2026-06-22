import type { Bot } from "grammy";
import { env } from "../config/env.js";

let botInstance: Bot | null = null;

export function setBot(bot: Bot) {
  botInstance = bot;
}

export async function sendOfferNotification(
  telegramId: number,
  giftName: string,
  price: number,
  giftId: number
) {
  if (!botInstance || !env.TELEGRAM_TOKEN) {
    console.log(`📩 [Mock] Offer notif to ${telegramId}: ${giftName} @ ${price}⭐`);
    return;
  }
  try {
    await botInstance.api.sendMessage(
      telegramId,
      `🎁 *New listing on FLUX*\n\nSomeone listed *${giftName}* for *${price} Stars*.\nInterested? Open FLUX to make an offer.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "👀 View & Offer",
                web_app: { url: `${env.WEBAPP_URL}/offers/${giftId}` },
              },
            ],
          ],
        },
      }
    );
  } catch (err) {
    console.error("Failed to send offer notification:", err);
  }
}

export async function sendOffersReadyNotification(
  telegramId: number,
  giftName: string,
  offerCount: number,
  giftId: number
) {
  if (!botInstance || !env.TELEGRAM_TOKEN) {
    console.log(`📩 [Mock] ${offerCount} offers for ${giftName} → ${telegramId}`);
    return;
  }
  try {
    await botInstance.api.sendMessage(
      telegramId,
      `🔔 *${offerCount} ${offerCount === 1 ? "person wants" : "people want"} your ${giftName}*\n\nTap to review and accept the best offer.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📋 View Offers",
                web_app: { url: `${env.WEBAPP_URL}/offers/${giftId}` },
              },
            ],
          ],
        },
      }
    );
  } catch (err) {
    console.error("Failed to send offers ready notification:", err);
  }
}

export async function sendTransactionConfirm(
  sellerTelegramId: number,
  buyerTelegramId: number,
  giftName: string,
  price: number,
  buyerUsername: string,
  buyerRating: number,
  buyerTrades: number
) {
  const msg = `✅ *Offer accepted!*\n\nYour *${giftName}* sold to @${buyerUsername} for *${price} Stars*.\nBuyer rating: ⭐${buyerRating} (${buyerTrades} trades)`;

  if (!botInstance || !env.TELEGRAM_TOKEN) {
    console.log(`📩 [Mock] Transaction: ${msg}`);
    return;
  }

  const keyboard = {
    inline_keyboard: [[{ text: "View in FLUX", web_app: { url: env.WEBAPP_URL } }]],
  };

  try {
    await botInstance.api.sendMessage(sellerTelegramId, msg, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
    await botInstance.api.sendMessage(
      buyerTelegramId,
      `✅ *Purchase complete!*\n\nYou bought *${giftName}* for *${price} Stars*.`,
      { parse_mode: "Markdown", reply_markup: keyboard }
    );
  } catch (err) {
    console.error("Failed to send transaction confirm:", err);
  }
}

export async function sendTypingAction(telegramId: number) {
  if (!botInstance) return;
  try {
    await botInstance.api.sendChatAction(telegramId, "typing");
  } catch {
    /* ignore */
  }
}

import * as GiftModel from "../models/Gift.js";
import * as OfferModel from "../models/Offer.js";
import * as UserModel from "../models/User.js";
import * as LeagueModel from "../models/LeagueMembership.js";
import { env } from "../config/env.js";
import * as notificationService from "./notificationService.js";

const auctionTimers = new Map<number, NodeJS.Timeout>();

export async function startReverseAuction(giftId: number, userId: number) {
  const gift = await GiftModel.getGift(giftId);
  if (!gift) throw new Error("Gift not found");
  if (gift.user_id !== userId) throw new Error("Not your gift");

  const buyers = await OfferModel.getTopRecentBuyers(10);

  await GiftModel.updateGiftStatus(giftId, "auction_active");

  for (const buyer of buyers) {
    const user = await UserModel.findById(buyer.buyer_id as number);
    if (user && user.id !== userId) {
      await notificationService.sendTypingAction(user.telegram_id);
      await notificationService.sendOfferNotification(
        user.telegram_id,
        gift.gift_name,
        gift.asking_price,
        giftId
      );

      const counterPrice = gift.asking_price + Math.floor(Math.random() * 20);
      await OfferModel.createOffer(
        giftId,
        user.id,
        counterPrice,
        user.rating
      );
    }
  }

  const seller = await UserModel.findById(userId);
  if (seller) {
    const offers = await OfferModel.getPendingOffersForGift(giftId);
    if (offers.length > 0) {
      await notificationService.sendOffersReadyNotification(
        seller.telegram_id,
        gift.gift_name,
        offers.length,
        giftId
      );
    }
  }

  if (auctionTimers.has(giftId)) clearTimeout(auctionTimers.get(giftId)!);
  auctionTimers.set(
    giftId,
    setTimeout(() => expireAuction(giftId), 48 * 60 * 60 * 1000)
  );

  return {
    status: "auction_started",
    expiresAt: gift.expires_at,
    offersSent: buyers.length,
  };
}

async function expireAuction(giftId: number) {
  const gift = await GiftModel.getGift(giftId);
  if (gift && gift.status === "auction_active") {
    const offers = await OfferModel.getPendingOffersForGift(giftId);
    if (offers.length === 0) {
      await GiftModel.updateGiftStatus(giftId, "listed");
    }
  }
  auctionTimers.delete(giftId);
}

export async function acceptOffer(offerId: number, sellerId: number) {
  const offer = await OfferModel.getOffer(offerId);
  if (!offer) throw new Error("Offer not found");

  const gift = await GiftModel.getGift(offer.gift_id);
  if (!gift) throw new Error("Gift not found");
  if (gift.user_id !== sellerId) throw new Error("Not your gift");

  const seller = await UserModel.findById(sellerId);
  const buyer = await UserModel.findById(offer.buyer_id);
  if (!seller || !buyer) throw new Error("User not found");

  if (buyer.balance_stars < offer.offered_price) {
    throw new Error("Buyer has insufficient Stars balance");
  }

  const hasBattlePass = UserModel.hasBattlePass(seller);
  const commissionRate = hasBattlePass ? env.BATTLE_PASS_COMMISSION_RATE : env.COMMISSION_RATE;
  const commission = Math.floor((offer.offered_price * commissionRate) / 100);
  const sellerPayout = offer.offered_price - commission;

  await OfferModel.acceptOffer(offerId);
  await GiftModel.updateGiftStatus(gift.id, "sold");

  await UserModel.updateBalance(sellerId, sellerPayout);
  await UserModel.updateBalance(offer.buyer_id, -offer.offered_price);
  await UserModel.incrementTrades(sellerId);
  await UserModel.incrementTrades(offer.buyer_id);
  await LeagueModel.incrementSales(sellerId);

  await notificationService.sendTransactionConfirm(
    seller.telegram_id,
    buyer.telegram_id,
    gift.gift_name,
    offer.offered_price,
    buyer.username || "buyer",
    buyer.rating,
    buyer.total_trades
  );

  return {
    status: "offer_accepted",
    payout: sellerPayout,
    commission,
  };
}

export async function submitCounterOffer(giftId: number, buyerId: number, offeredPrice: number) {
  const gift = await GiftModel.getGift(giftId);
  if (!gift) throw new Error("Gift not found");
  if (gift.user_id === buyerId) throw new Error("Cannot offer on your own gift");

  const buyer = await UserModel.findById(buyerId);
  if (!buyer) throw new Error("Buyer not found");

  const offer = await OfferModel.createOffer(giftId, buyerId, offeredPrice, buyer.rating);
  return offer;
}

export async function getOffersForGift(giftId: number, userId: number) {
  const gift = await GiftModel.getGift(giftId);
  if (!gift) throw new Error("Gift not found");
  if (gift.user_id !== userId) throw new Error("Not your gift");
  return OfferModel.getPendingOffersForGift(giftId);
}

export async function getAllPendingOffers(userId: number) {
  return OfferModel.getPendingOffersForSeller(userId);
}

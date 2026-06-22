import * as GiftModel from "../models/Gift.js";
import * as OfferModel from "../models/Offer.js";

export const DEMO_INVENTORY = [
  { name: "Sticker #101", type: "sticker", count: 3 },
  { name: "Sticker #1234", type: "sticker", count: 1 },
  { name: "Gift NFT-Style", type: "gift", count: 1 },
  { name: "Sticker #5678", type: "sticker", count: 2 },
  { name: "Premium Emoji Pack", type: "gift", count: 1 },
];

export async function listGift(
  userId: number,
  giftName: string,
  giftType: string,
  askingPrice: number
) {
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const gift = await GiftModel.createGift(userId, giftName, giftType, askingPrice, expiresAt);
  return gift;
}

export async function getMyGifts(userId: number) {
  const gifts = await GiftModel.getGiftsByUser(userId);
  const withOffers = await Promise.all(
    gifts.map(async (gift) => {
      const offers = await OfferModel.getPendingOffersForGift(gift.id);
      return { ...gift, pendingOffersCount: offers.length };
    })
  );
  return withOffers;
}

export async function cancelListing(giftId: number, userId: number) {
  return GiftModel.cancelGift(giftId, userId);
}

export { getGift } from "../models/Gift.js";

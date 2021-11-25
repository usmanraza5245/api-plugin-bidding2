import placeBidOnProduct from "../utils/placeBidOnProduct.js";
import createOffer from "../utils/createOffer.js";
import addOfferPriceToCart from "../utils/addOfferPriceToCart.js";
import createNotification from "../utils/createNotification.js";
import markAsRead from "../utils/markAsRead.js";
export default {
  async placeBidOnProduct(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let bidId = await placeBidOnProduct(context, args.input);
    return { bidId };
  },
  async sendOffer(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let offer = await createOffer(context, args.input);

    return offer;
  },
  async updateCartOfferPrice(parent, args, context, info) {
    console.log("updateCartOfferPrice");
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let price_Updated = await addOfferPriceToCart(context, args);
    return price_Updated;
  },
  async createNotification(parent, args, context, info) {
    console.log("createNotification", args);
    let result = await createNotification(context, args.input);
    return result;
  },
  async markAsRead(parent, args, context, info) {
    console.log("markAsRead", args);
    let mkr = await markAsRead(context, args);
    return mkr;
  },
};

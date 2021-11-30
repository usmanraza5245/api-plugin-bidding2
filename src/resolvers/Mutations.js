import placeBidOnProduct from "../utils/placeBidOnProduct.js";
import createOffer from "../utils/createOffer.js";
import addOfferPriceToCart from "../utils/addOfferPriceToCart.js";
import createNotification from "../utils/createNotification.js";
import markAsRead from "../utils/markAsRead.js";
import addFollower from "../utils/addFollower.js";
import removeFollower from "../utils/removeFollower.js";

export default {
  // Offer mutation Start
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
  // Offer Mutation End
  async followUser(parent, args, context, info) {
    console.log("follow user mutation");
    const follow_response=await addFollower(context,args);
    return follow_response;
  },
  async unfollowUser(parent, args, context, info) {
    const unfollow_response = await removeFollower(context,args)
    return unfollow_response;

    console.log("unfollow user mutation");
  },
};

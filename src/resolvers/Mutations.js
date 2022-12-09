import placeBidOnProduct from "../utils/placeBidOnProduct.js";
import createOffer from "../utils/createOffer.js";
import addOfferPriceToCart from "../utils/addOfferPriceToCart.js";
import createNotification from "../utils/createNotification.js";
import markAsRead from "../utils/markAsRead.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
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
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    console.log("follow user mutation");
    const follow_response=await addFollower(context,args);
    return follow_response;
  },
  async unfollowUser(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    const unfollow_response = await removeFollower(context,args)
    return unfollow_response;

  },
  async removeBid(parent, args, context, info) {
    const { collections } = context;
    const { Bids } = collections;
    const { bidId } = args;
    let accountId = context.userId;
    console.log("user id", accountId);
    let deletedBid = await Bids.remove({ _id: bidId, createdBy: accountId });
    console.log("deleted Bid", deletedBid);
    if( deletedBid?.result?.n > 0 )
      return {
        success: true,
        status: 200,
        message: "bid deleted."
      }
    else
      return {
        success: false,
        status: 200,
        message: "could not delete bid."
      }
  },
  async removeProduct(parent, args, context, info) {
    const { collections } = context;
    const { Products, Catalog, Bids } = collections;
    const { productId } = args;
    let accountId = context.userId;
    let decodeProductId = decodeOpaqueId(productId).id;
    console.log("user id", accountId, decodeProductId);
    let deletedFromCatalog = await Catalog.remove({ "product.productId": decodeProductId, "product.uploadedBy.userId": accountId });
    let deletedFromProduct = await Products.remove({ _id: decodeProductId, "uploadedBy.userId": accountId });
    console.log("deleted deletedFromCatalog", deletedFromCatalog, "deletedFromProduct", deletedFromProduct);
    if( deletedFromProduct?.result?.n > 0 ){
      let deletedFromBid = await Bids.remove({ productId: decodeProductId });
      console.log("deletedFromBid", deletedFromBid)
      return {
        success: true,
        status: 200,
        message: "product deleted."
      }
    } 
    else
      return {
        success: false,
        status: 200,
        message: "could not delete product."
      }
  },
  async updateBidonProduct(parent, args, context, info) {
    const { collections } = context;
    const { Bids } = collections;
    const { isShortList, isFavourite, bidId } = args.input;
    let accountId = context.userId;
    // let decodeProductId = decodeOpaqueId(productId).id;
    console.log("updated bids", accountId, bidId, isFavourite, isShortList);
    let updatedBid = await Bids.updateOne(
      { _id: bidId },
      { $set: { isShortList: isShortList, isFavourite: isFavourite }}
    )
    console.log("updatedBid", updatedBid)
    if( updatedBid?.result?.nModified > 0 ){
      return {
        success: true,
        status: 200,
        message: "operation successfull."
      }
    } 
    else
      return {
        success: false,
        status: 200,
        message: "could not delete operation."
      }
  }
};

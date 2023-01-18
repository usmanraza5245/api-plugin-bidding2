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
    const { collections, user } = context;
    const { Products, Catalog, Bids } = collections;
    const { productId } = args;
    let accountId = context.userId;
    let deletedFromCatalog, deletedFromProduct;
    let decodeProductId = decodeOpaqueId(productId).id;
    console.log("process.env.ADMIN_EMAIL", process.env.ADMIN_EMAIL)
    // console.log("user id", accountId, decodeProductId, user);
    console.log("userInfo", user)
    if( user?.emails?.[0]?.address === process.env.ADMIN_EMAIL ){
      console.log("first if")
      deletedFromCatalog = await Catalog.remove({ "product.productId": decodeProductId });
      deletedFromProduct = await Products.remove({ _id: decodeProductId });
    } else {
      console.log("else")
      deletedFromCatalog = await Catalog.remove({ "product.productId": decodeProductId, "product.uploadedBy.userId": accountId });
      deletedFromProduct = await Products.remove({ _id: decodeProductId, "uploadedBy.userId": accountId });
    }
    // console.log("deleted deletedFromCatalog", deletedFromCatalog, "deletedFromProduct", deletedFromProduct);
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
  },
  // accept bid offer mutation
  async acceptBid(parent, args, context, info) {
    try{
      let _id = args.bidId;
      let { Bids } = context.collections;
      // update bid status to accepted
      console.log(process.env.SUBMISSION_ACCEPTED)
      let acceptedBid = await Bids.updateOne(
        { _id },
        { $set: { status: process.env.SUBMISSION_ACCEPTED } }
      )
      console.log("acceptedBid", acceptedBid);
      if( acceptedBid?.result?.nModified > 0 ){
        return {
          success: true,
          status: 200,
          message: "Submission Accepted."
        }
      } else {
        return {
          success: false,
          status: 200,
          message: "could not accept."
        }
      }
    }catch(err){
      console.log("Error", err);
      return {
        success: false,
        message: "Server Error.",
        status: 500
      }
    }
  }
};

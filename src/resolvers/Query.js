import getBidsbyAccountId from "../utils/getBidsbyAccountId.js";
import getBidbyAccountId from "../utils/getBidbyAccountId.js";
import getBidsbySellerId from "../utils/getBidsbySellerId.js";
import getActiveBids from "../utils/getActiveBids.js";
export default {
  async getBidsbyAccountId(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let bids = await getBidsbyAccountId(context, args);
    return bids;
  },
  async getBidsbySellerId(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let bids = await getBidsbySellerId(context, args);
    return bids;
  },
  async getActiveBidOnProduct(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let activeBids = await getActiveBids(context, args.input);
    let is_valid = false;

    if (activeBids) {
      if(activeBids.acceptedOffer){
        var d1 = new Date();
        var d2 = new Date(activeBids.acceptedOffer.validTill);
        console.log(d1.getTime() <= d2.getTime());
        if (d1.getTime() <= d2.getTime()) {
          is_valid = true;
        }
        if (is_valid) {
          return { offer: activeBids.acceptedOffer, isValid: is_valid,bidId:activeBids._id };
        } else {
          return null;
        }
      }
     
     else {
        return { bidId:activeBids._id,offer:null,isValid:is_valid };
      }
    } else {
      return null;
    }
  },
  async getBidsbyUserId(parent, args, context, info) {
    console.log("getBidsbyUserList");
    let user_bid=await getBidbyAccountId(context,args);
    console.log("user_bid",user_bid);
    return user_bid;
  },
};

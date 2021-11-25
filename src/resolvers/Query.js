import getBidsbyAccountId from "../utils/getBidsbyAccountId.js";
import getBidbyAccountId from "../utils/getBidbyAccountId.js";
import getBidsbySellerId from "../utils/getBidsbySellerId.js";
import getActiveBids from "../utils/getActiveBids.js";
import getNotificationByAccountId from "../utils/getNotificationByAccountId.js";
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
    console.log("active bid",activeBids);
    let is_valid = false;

    if (activeBids) {
      console.log("inside fist if active bid");
      if(activeBids.acceptedOffer){
        console.log("offer accepted");
        var d1 = new Date();
        var d2 = new Date(activeBids.acceptedOffer.validTill);
        console.log(d1.getTime() <= d2.getTime());
        if (d1.getTime() <= d2.getTime()) {
          is_valid = true;
        }
        if (is_valid) {
          console.log("offer valid");
          return { offer: activeBids.acceptedOffer, isValid: is_valid,bidId:activeBids._id };
        } else {
          console.log("offer exist not valid");
          return null;
        }
      }
     
     else {
      console.log("bid exist offer not aqccepted");
        return { bidId:activeBids._id,offer:null,isValid:is_valid };
      }
    } else {
      console.log("no bid exist");
      return null;
    }
  },
  async getBidsbyUserId(parent, args, context, info) {
    console.log("getBidsbyUserList");
    let user_bid=await getBidbyAccountId(context,args);
    console.log("user_bid",user_bid);
    return user_bid;
  },
  async myNotifications(parent, args, context, info){
  
    console.log("myNotifications")
    let myNotif=await getNotificationByAccountId(context);
    return myNotif
  }
};

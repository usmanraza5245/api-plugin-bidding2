import getBidsbyAccountId from "../utils/getBidsbyAccountId.js"
import getBidsbySellerId from "../utils/getBidsbySellerId.js"
export default {
  async getBidsbyAccountId(parent, args, context, info) {
    console.log("getBidsbyAccountId query called");
    let bids = await getBidsbyAccountId(context, args);
    console.log("bids", bids);
    return bids;
  },
  async getBidsbySellerId(parent, args, context, info) {
    console.log("getBidsbyAccountId query called");
    let bids = await getBidsbySellerId(context, args);
    console.log("bids", bids);
    return bids;
  },
};

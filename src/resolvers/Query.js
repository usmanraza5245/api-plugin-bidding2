import getBidsbyAccountId from "../utils/getBidsbyAccountId.js"
import getBidsbySellerId from "../utils/getBidsbySellerId.js"
export default {
  async getBidsbyAccountId(parent, args, context, info) {
    let bids = await getBidsbyAccountId(context, args);
    return bids;
  },
  async getBidsbySellerId(parent, args, context, info) {
    let bids = await getBidsbySellerId(context, args);
    return bids;
  },
};

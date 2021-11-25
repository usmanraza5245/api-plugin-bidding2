import getOffersbyBidId from "../utils/getOffersbyBidId.js";
export default {
  offer: {
    subscribe: function subscribe(parent, args, context, info) {
      let { userId } = args;
      console.log("onNewOffer subscription");
      // console.log(args);
      // console.log(info);
      let { pubSub } = context;
      return pubSub.asyncIterator(`offers ${userId}`);
    },
  },
  newBid: {
    subscribe: function subscribe(parent, args, context, info) {
      console.log("newBid sibscribe");
      let { userId } = args;

      let { pubSub } = context;

      return pubSub.asyncIterator(`newBids ${userId}`);
    },
  },
  startCoinToss: {
    subscribe: function subscribe(parent, args, context, info) {
      console.log("startCoinToss sibscribe");
      let { bidId } = args;

      let { pubSub } = context;

      return pubSub.asyncIterator(`StartGame ${bidId}`);
    },
  },
  
  notifications: {
    subscribe: function subscribe(parent, args, context, info) {
      console.log("notifications sibscribe");
      let { userId } = args;

      let { pubSub } = context;

      return pubSub.asyncIterator(`notifications-${userId}`);
    },
  },
};

import getOffersbyBidId from "../utils/getOffersbyBidId.js";
export default {
    offer: {
        subscribe:  function subscribe(parent, args, context, info) {
   
        let {userId}=args;
        console.log("onNewOffer subscription")
        // console.log(args);
        // console.log(info);
        let {pubSub}=context;
        console.log(`newOffer ${userId}`)
        // return pubSub.asyncIterator(`newOffer`)
        return pubSub.asyncIterator(`${userId}`)
     
    }
}
}
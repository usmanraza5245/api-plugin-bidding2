import placeBidOnProduct  from "../utils/placeBidOnProduct.js";
import createOffer  from "../utils/createOffer.js";
export default {
  async placeBidOnProduct(parent, args, context, info) {

    console.log("placeBidOnProduct mutaion called");
    let accountId=context.userId;
    if(!accountId||accountId==null){
        console.log("Unauthenticated user");
        throw new Error("Unauthenticated user");
    }
    console.log("input arguments",args.input);
    let bidId=await placeBidOnProduct(context,args.input);
    return {bidId};
  },
  async sendOffer(parent,args,context,info){
      let offer=await createOffer(context,args.input)
      return offer;
  }
};

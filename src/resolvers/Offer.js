import getProductbyId from "../utils/getProductbyId.js";
import getAccountById from "../utils/getAccountById.js";
export default {
//   Bid: {
    async product(parent, args, context, info) {
      console.log("bid product called");
      let cat_product=await getProductbyId(context,parent);
      return cat_product.product;
    },

    async sender(parent, args, context, info) {
      let account=await getAccountById(context,parent.createdBy)
      return {
        name: account.name
          ? account.name
          : account.profile.name
          ? account.profile.name
          : account.username
          ? account.username
          : account.profile.username
          ? account.profile.username
          : "Anonymous",
        image: account.profile.picture,
      };
    },
    async reciever(parent, args, context, info) {
      let account= await getAccountById(context,parent.createdFor)
      return {
        name: account.name
          ? account.name
          : account.profile.name
          ? account.profile.name
          : account.username
          ? account.username
          : account.profile.username
          ? account.profile.username
          : "Anonymous",
        image: account.profile.picture,
      };
    },
//   },
};

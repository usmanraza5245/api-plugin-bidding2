import getFollows from "../utils/getFollows.js";
import getProductsbyuserId from "../utils/getProductsbyuserId.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";

export default {
  async follower(parent, args, context, info) {
    let followers = await getFollows(context, {
      userId: parent.userId,
      lookFor: parent.followerData,
    });
    return followers;
  },
  async following(parent, args, context, info) {
    let followers = await getFollows(context, {
      userId: parent.userId,
      lookFor: parent.followingData,
    });
    return followers;
  },

  async products(parent, args, context, info) {
    console.log("follow products");
    let products = await getProductsbyuserId(context, parent);
    return products;
  },

  async parentId(parent, args, context, info) {
    return encodeOpaqueId("reaction/product", parent.ancestors[0]);
    //encode( encodeOpaqueId(parent.ancestors[0]))
  },
};

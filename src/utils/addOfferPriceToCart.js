import generateUID from "./generateUID.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
/**
 *
 * @method addOfferPriceToCart
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function addOfferPriceToCart(context, args) {
  const { collections } = context;
  const { Bids, Cart } = collections;
  const { bidId, cartId } = args;
  let accountId = context.userId;
  if (!bidId || bidId.length == 0) {
    throw new Error("bidId is required");
  }
  if (!cartId || cartId.length == 0) {
    throw new Error("cartId is required");
  }
  let bidExist = await Bids.findOne({ _id: bidId });
  if (!bidExist) {
    throw new Error("invalid bid ID");
  }
  let cart_update=null;
  let cartExist = await Cart.findOne({ accountId: bidExist.createdBy });
  if(cartExist&&cartExist.items[0]){

    let productExist = cartExist.items[0].productId == bidExist.productId;
    if(productExist){

       cart_update = await Cart.updateOne(
        { _id: cartExist._id },
        { $set: { "items.0.price.amount": bidExist.activeOffer.amount.amount,
        "items.0.subtotal.amount": bidExist.activeOffer.amount.amount }});
    }
    
  }
  if (cart_update.modifiedCount) {
  let updatedCart = await Cart.findOne({ accountId: bidExist.createdBy });

    return updatedCart;
  } else {
    throw new Error("Something went wrong");
  }
  // let new_id = await generateUID();
  //  let insert_obj = {
  //   _id: new_id,
  //   productId: decodeProductId,
  //   shopId: decodeShopId,
  //   createdBy: accountId,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   status: "new",
  //   offers: [{ ...offer, createdBy: accountId }],
  // };
  // let BidsAdded = await Bids.insertOne(insert_obj);
  // if (BidsAdded.insertedId) {
  //   return BidsAdded.insertedId;
  //   // return Bids.findOne({"_id":BidsAdded.insertedId});
  // } else {
  //   throw new Error("Something went wrong");
  // }
  // return BidsAdded.insertedId;
  // return Products.find(selector).toArray();
}

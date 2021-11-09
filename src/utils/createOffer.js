import generateUID from "./generateUID.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
/**
 *
 * @method placeBidOnProduct
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function createOffer(context, args) {
  const { collections,pubSub } = context;
  const { Bids } = collections;
  const { bidId, offer, to } = args;
  let accountId = context.userId;
  if (!bidId || bidId.length == 0) {
    throw new Error("bidId is required");
  }
  console.log("accountId", accountId);
  console.log("bidId", bidId);
  console.log(offer);
  let bidExist = await Bids.findOne({ _id: bidId });
  if (!bidExist) {
    throw new Error("invalid bid ID");
  }
  let offerObj = {
    ...offer,
    createdBy: accountId,
    createdAt: new Date(),
    _id: await generateUID(),
    createdFor: to,
  };
  let bid_update = await Bids.updateOne(
    { _id: bidId },
    {
      $addToSet: {
        offers: offerObj,
      }

    }
  );
  console.log(bid_update);
  if (bid_update.modifiedCount) {
    pubSub.publish(`newOffer ${bidId}`, {offer: offerObj })

    return offerObj;
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

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
  const { collections, pubSub } = context;
  const { Bids, Cart } = collections;
  const { bidId, offer, to, type } = args;
  let accountId = context.userId;
  if (!bidId || bidId.length == 0) {
    throw new Error("bidId is required");
  }
  let bidExist = await Bids.findOne({ _id: bidId });
  if (!bidExist) {
    throw new Error("invalid bid ID");
  }
  let offerObj = {
    ...offer,
    type: type,
    createdBy: accountId,
    createdAt: new Date(),
    _id: await generateUID(),
    createdFor: to,
  };
  let bid_update = null;
  if (type == "counterOffer") {
    bid_update = await Bids.updateOne(
      { _id: bidId },
      {
        $addToSet: {
          offers: offerObj,
        },
        $set: {
          activeOffer: offerObj,
          status: "inProgress",
          canAccept: to,
        },
      }
    );
  } else if (type == "acceptedOffer") {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    let valid_till = date;
    let cartExist = await Cart.findOne({ accountId: bidExist.createdBy });
    if(cartExist&&cartExist.items[0]){

      let productExist = cartExist.items[0]._id == bidExist.productId;
      if(productExist){

        let cart_update = await Cart.updateOne(
          { _id: cartExist._id },
          { $set: { "items.0.price.amount": bidExist.activeOffer.amount.amount,
          "items.0.subtotal.amount": bidExist.activeOffer.amount.amount }});
      }
      
    }
    bid_update = await Bids.updateOne(
      { _id: bidId },
      {
        $addToSet: {
          offers: offerObj,
        },
        $set: {
          acceptedOffer: { ...bidExist.activeOffer, validTill: valid_till },
          acceptedBy: accountId,
          canAccept: null,
          status: "closed",
        },
      }
    );
  } else if (type == "rejectOffer") {
    bid_update = await Bids.updateOne(
      { _id: bidId },
      {
        $addToSet: {
          offers: offerObj,
        },
        $set: {
          status: "closed",
        },
      }
    );
  } else {
    bid_update = await Bids.updateOne(
      { _id: bidId },
      {
        $addToSet: {
          offers: offerObj,
        },
        $set: {
          status: "inProgress",
        },
      }
    );
  }

  if (bid_update.modifiedCount) {
    pubSub.publish(`offers ${to}`, {
      offer: {
        offer: offerObj,
        variantId: bidExist.variantId,
        productId: bidExist.productId,
        bidId: bidExist._id,
        userId: to,
      },
    });

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

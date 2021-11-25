import generateUID from "./generateUID.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
/**
 *
 * @method markAsRead
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function markAsRead(context, args) {
  const { collections } = context;
  const { Notifications } = collections;
  const { notificationId } = args;
  console.log("update for ", notificationId);
  let Notifications_update = await Notifications.updateOne(
    { _id: notificationId },
    {
      $set: {
        status: "read",
      },
    }
  );
  if (Notifications_update.modifiedCount) {
    let nptif_res = await Notifications.findOne({ _id: notificationId });
    console.log(nptif_res);
    return nptif_res;
  } else {
    throw new Error("Something went wrong");
  }
}

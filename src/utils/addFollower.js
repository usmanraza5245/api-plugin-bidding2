import createNotification from "./createNotification.js";
import getAccountById from "./getAccountById.js";
import getAccountByuserName from "./getAccountByuserName.js";

/**
 *
 * @method addFollower
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function addFollower(context, args) {
  const { collections, pubSub } = context;
  const { Accounts } = collections;
  const { userName } = args;
  const accountId = context.userId;
  const userExist = await getAccountByuserName(context, userName);
  let user_update=null;
  if (userExist) {
    user_update = await Accounts.updateOne(
      { _id: accountId },
      {
        $addToSet: {
          following: userExist.userId,
        },
      }
    );
    if (user_update.modifiedCount) {
      // started folowing you
      const senderAccount = await getAccountById(context, accountId);

      createNotification(context, {
        details: null,
        from: accountId,
        hasDetails: false,
        message: `started following you.`,
        status: "unread",
        to: userExist.userId,
        type: "follow",
        url: `/en/userName/`,
      });
      return true;
    } else {
      return false;
    }
  } else {
    throw new Error(
      "We are unable to complete requested operation at the moment"
    );
  }
}

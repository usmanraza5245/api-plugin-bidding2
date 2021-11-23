import generateUID from "./generateUID.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
/**
 *
 * @method coinToss
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function coinToss(context, args) {
  const { collections, pubSub } = context;

  let head_score=0;
  let tail_score=0;

  
  var head = 1;
  var tail = 2;

  var toss = Math.random() * 2 ;
  console.log("toss",toss)
  var floor = Math.floor(toss);
  let win_val = "";
  if (floor === 0) {
    console.log("0 <br> Random Coin Value: Head");
    win_val = "head";
  } else if (floor === 1) {
    console.log("1 <br> Random Coin Value: Tails");
    win_val = "tail";
  }
  return win_val;
}

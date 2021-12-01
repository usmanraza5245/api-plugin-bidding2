
/**
 *
 * @method getFollows
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function getFollows(context, args) {
  const { collections, pubSub } = context;
  const { Accounts } = collections;
  const { userId,lookFor } = args;
  const accountId = context.userId;
  if(lookFor&&lookFor.length>0){
    
  // let data=await Accounts.find({_id: { $in: lookFor } },{"profile":1,"username":1,"name":1}).toArray();
  let data=await Accounts.find({_id: { $in: lookFor } }).toArray();
  return data;
  }
 
}

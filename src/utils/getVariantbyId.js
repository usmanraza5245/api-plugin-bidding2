import generateUID from "./generateUID.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
/**
 *
 * @method getVariantbyId
 * @summary Get all of a Unit's Variants or only a Unit's top level Variants.
 * @param {Object} context - an object containing the per-request state
 * @param {String} unitOrVariantId - A Unit or top level Unit Variant ID.
 * @param {Boolean} topOnly - True to return only a units top level variants.
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Boolean} args.shouldIncludeHidden - Include hidden units in results
 * @param {Boolean} args.shouldIncludeArchived - Include archived units in results
 * @returns {Promise<Object[]>} Array of Unit Variant objects.
 */
export default async function getVariantbyId(context, args,bid) {
  const { collections } = context;
  const { Products } = collections;
  const {variantId} = args;
  console.log('args',args)
  console.log("product id for search",variantId)
 let product= await Products.findOne({"_id":variantId});
 console.log("product",product)
 return product;
}

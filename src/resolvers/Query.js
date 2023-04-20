import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import getBidsbyAccountId from "../utils/getBidsbyAccountId.js";
import getBidbyAccountId from "../utils/getBidbyAccountId.js";
import getBidsbySellerId from "../utils/getBidsbySellerId.js";
import getActiveBids from "../utils/getActiveBids.js";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import getNotificationByAccountId from "../utils/getNotificationByAccountId.js";
import getAccountByuserName from "../utils/getAccountByuserName.js";
import ObjectId from "mongodb";
console.log("ObjectId-----------  ", ObjectId, ObjectId.ObjectID);
import isAvailable from "../utils/isAvailable.js";
export default {
  async isAvailable(parent, args, context, info) {
    console.log("is available ");
    let response = await isAvailable(context, args);
    return response;
  },
  async getBidsbyAccountId(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let bids = await getBidsbyAccountId(context, args);
    return bids;
  },
  async getBidsbySellerId(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let bids = await getBidsbySellerId(context, args);
    return bids;
  },
  async getActiveBidOnProduct(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    let activeBids = await getActiveBids(context, args.input);
    console.log("active bid", activeBids);
    let is_valid = false;

    if (activeBids) {
      console.log("inside fist if active bid");
      if (activeBids.acceptedOffer) {
        console.log("offer accepted");
        var d1 = new Date();
        var d2 = new Date(activeBids.acceptedOffer.validTill);
        console.log(d1.getTime() <= d2.getTime());
        if (d1.getTime() <= d2.getTime()) {
          is_valid = true;
        }
        if (is_valid) {
          console.log("offer valid");
          return {
            offer: activeBids.acceptedOffer,
            isValid: is_valid,
            bidId: activeBids._id,
          };
        } else {
          console.log("offer exist not valid");
          return null;
        }
      } else {
        console.log("bid exist offer not aqccepted");
        return { bidId: activeBids._id, offer: null, isValid: is_valid };
      }
    } else {
      console.log("no bid exist");
      return null;
    }
  },
  async getMyBidsOnProduct(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    // let activeBids = await getActiveBids(context, args.input);
    // console.log("active bid", activeBids);
    // let is_valid = false;
    const { collections } = context;
    const { productId, variantId } = args.input;
    const { Bids } = collections;
    // let accountId = context.userId;

    let decodeProductId = decodeOpaqueId(productId).id;
    let decodeVariantId = decodeOpaqueId(variantId).id;
    if (decodeProductId == productId || productId.length == 0) {
      throw new Error("ProductId must be a Reaction ID");
    }
    if (decodeVariantId == variantId || variantId.length == 0) {
      throw new Error("variantId must be a Reaction ID");
    }
    console.log("accountId", accountId);
    let bidsOnProduct = await Bids.find({
      productId: decodeProductId,
      variantId: decodeVariantId,
      createdBy: accountId,
    }).toArray();
    console.log("bidsOnProduct", bidsOnProduct);
    return bidsOnProduct;
  },
  async getBidsbyUserId(parent, args, context, info) {
    console.log("getBidsbyUserList");
    let user_bid = await getBidbyAccountId(context, args);
    console.log("user_bid", user_bid);
    return user_bid;
  },
  async myNotifications(parent, args, context, info) {
    console.log("myNotifications");
    let myNotif = await getNotificationByAccountId(context);
    return myNotif;
  },
  async getUserByuserName(parent, args, context, info) {
    let account = await getAccountByuserName(context, args.userName);
    console.log("account", account);
    if (account) {
      return {
        userId: account.userId,
        userName: args.userName,
        name: account.name
          ? account.name
          : account.profile.name
          ? account.profile.name
          : null,
        profilePhoto: account.profile.picture,
        followerData: account.follower,
        followingData: account.following,
        canFollow:
          (account.follower &&
            account.follower.indexOf(context.userId) == -1) ||
          account.follower == undefined
            ? true
            : false,
        isVerified: account.profile.identityVerified ? true : false,
      };
    } else {
      throw new Error("User does not exist.");
    }
  },
  async getOpportunities(parent, args, context, info) {
    const { userId, pageNo, perPage } = args.input;
    const { collections } = context;
    console.log("userIds", userId);
    const { Catalog, Products } = collections;
    if (userId) {
      // let selector = {
      //   "product.uploadedBy.userId": userId
      // }
      // var documentIds = userId.map(function(myId) { return ObjectId.ObjectID.ObjectId(myId); });
      // console.log("documents", documentIds)
      let opportunities = await Catalog.find({
        "product.uploadedBy.userId": { $in: userId },
      })
        .skip(pageNo > 0 ? (pageNo - 1) * perPage : 0)
        .limit(perPage)
        .toArray();
      // let opportunities = await Catalog.aggregate({ $match:  {"product.uploadedBy.userId": { $eq: userId }}}).toArray();
      console.log("first if opportunities", opportunities);
      return opportunities;
    } else {
      let opportunities = await Catalog.find()
        .skip(pageNo > 0 ? (pageNo - 1) * perPage : 0)
        .limit(perPage)
        .toArray();
      console.log("else opportunities", opportunities);
      return opportunities;
    }
    // Only include visible variants if `false`
    // Otherwise both hidden and visible will be shown
    // if (shouldIncludeHidden === false) {
    //   selector.isVisible = true;
    // }

    // // Exclude archived (deleted) variants if set to `false`
    // // Otherwise include archived variants in the results
    // if (shouldIncludeArchived === false) {
    //   selector.isDeleted = {
    //     $ne: true,
    //   };
    // }
  },
  async getBidsOnMyProduct(parent, args, context, info) {
    let { input, ...connectionArgs } = args;
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    const { collections } = context;
    const { productId, variantId, first, offset, after, before } = input;
    if (first) {
      connectionArgs.first = first;
    }
    if (offset) {
      connectionArgs.offset = offset;
    }
    if (after) {
      connectionArgs.after = after;
    }
    if (before) {
      connectionArgs.before = before;
    }
    const { Bids } = collections;
    // let accountId = context.userId;

    let decodeProductId = decodeOpaqueId(productId).id;
    let decodeVariantId = decodeOpaqueId(variantId).id;
    if (decodeProductId == productId || productId.length == 0) {
      throw new Error("ProductId must be a Reaction ID");
    }
    if (decodeVariantId == variantId || variantId.length == 0) {
      throw new Error("variantId must be a Reaction ID");
    }
    console.log("accountId", accountId);
    console.log("context query ", info);
    let bidsOnProduct = Bids.find({
      productId: decodeProductId,
      variantId: decodeVariantId,
      soldBy: accountId,
    });
    console.log("bidsOnProduct", bidsOnProduct);
    return getPaginatedResponse(bidsOnProduct, connectionArgs, {
      includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
      includeHasPreviousPage: wasFieldRequested(
        "pageInfo.hasPreviousPage",
        info
      ),
      includeTotalCount: wasFieldRequested("totalCount", info),
    });
    // return bidsOnProduct;
  },
  async getFilteredBids(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    const { collections } = context;
    const { productId, variantId, flag } = args.input;
    const { Bids } = collections;
    // let accountId = context.userId;

    let decodeProductId = decodeOpaqueId(productId).id;
    let decodeVariantId = decodeOpaqueId(variantId).id;
    if (decodeProductId == productId || productId.length == 0) {
      throw new Error("ProductId must be a Reaction ID");
    }
    if (decodeVariantId == variantId || variantId.length == 0) {
      throw new Error("variantId must be a Reaction ID");
    }
    console.log("accountId", accountId);
    let bidsOnProduct;
    if (flag === "shortListed") {
      bidsOnProduct = await Bids.find({
        productId: decodeProductId,
        variantId: decodeVariantId,
        isShortList: true,
      }).toArray();
    } else if (flag === "favourite") {
      bidsOnProduct = await Bids.find({
        productId: decodeProductId,
        variantId: decodeVariantId,
        isFavourite: true,
      }).toArray();
    }
    console.log("bidsOnProduct", bidsOnProduct);
    return bidsOnProduct;
  },
  async getProductBids(parent, args, context, info) {
    let accountId = context.userId;
    if (!accountId || accountId == null) {
      console.log("Unauthenticated user");
      throw new Error("Unauthenticated user");
    }
    const { collections } = context;
    const { productId, variantId } = args.input;
    const { Bids } = collections;
    // let accountId = context.userId;

    let decodeProductId = decodeOpaqueId(productId).id;
    let decodeVariantId = decodeOpaqueId(variantId).id;
    if (decodeProductId == productId || productId.length == 0) {
      throw new Error("ProductId must be a Reaction ID");
    }
    if (decodeVariantId == variantId || variantId.length == 0) {
      throw new Error("variantId must be a Reaction ID");
    }
    console.log("accountId", accountId);
    let bidsOnProduct = await Bids.find({
      productId: decodeProductId,
      variantId: decodeVariantId,
    }).toArray();
    console.log("bidsOnProduct", bidsOnProduct);
    return {
      bids: bidsOnProduct,
      count: bidsOnProduct?.length,
    };
  },
};

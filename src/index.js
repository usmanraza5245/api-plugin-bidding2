import pkg from "../package.json";
import importAsString from "@reactioncommerce/api-utils/importAsString.js";
import _ from "lodash";
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutations.js";
import Subscription from "./resolvers/Subscription.js";
import Bid from "./resolvers/Bid.js";
import Offer from "./resolvers/Offer.js";
import Notification from "./resolvers/Notification.js";
import coinTossSubscriptionPayload from "./resolvers/coinTossSubscriptionPayload.js";
const mySchema = importAsString("./schema.graphql");

var _context = null;

const resolvers = {
  Query,
  Mutation,
  coinTossSubscriptionPayload,
  Subscription,
  Bid,
  Notification,
  Offer
};

function biddingStartUp(context) {
  _context = context;
  const { app, collections, rootUrl } = context;
}

/**
 *
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "bidding",
    name: "bidding",
    version: pkg.version,
    collections: {
      Bids: {
        name: "Bids",
        updatedAt: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
        indexes: [
          // Create indexes. We set specific names for backwards compatibility
          // with indexes created by the aldeed:schema-index Meteor package.
          [{ productId: 1 }, { name: "c2_productId" }],
          [{ accountId: 1 }, { name: "c2_accountId" }],
          [{ createdAt: 1 }, { name: "c2_createdAt" }],
          [{ updatedAt: 1, _id: 1 }],
        ],
      },
    },
    functionsByType: {
      startup: [biddingStartUp],
    },
    graphQL: {
      schemas: [mySchema],
      resolvers,
    },
  });
}

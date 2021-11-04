import pkg from "../package.json";
import importAsString from "@reactioncommerce/api-utils/importAsString.js";
import _ from "lodash";

const mySchema = importAsString("./schema.graphql");

var _context = null;

const resolvers = {
  Query: {},
  Mutation: {},
};

function biddingStartUp(context) {
  _context = context;
  const { app, collections, rootUrl } = context;



}

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "bidding",
    name: "bidding",
    version: pkg.version,
    functionsByType: {
      startup: [CourierAPIStartUp],
    },
    graphQL: {
      schemas: [mySchema],
      resolvers,
    },
  });
}

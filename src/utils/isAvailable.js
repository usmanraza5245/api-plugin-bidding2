/**
 *
 * @method isAvailable
 * @summary Checks if a username is available .
 * @param {Object} context - an object containing the per-request state
 * @param {Object} args - an object of all arguments that were sent by the client
 */
export default async function isAvailable(context, args) {
  const { collections } = context;
  const { Accounts, users } = collections;
  const { userName } = args;
  let accounts_exist = await Accounts.findOne({ "profile.username": userName });
  let users_exist = await users.findOne({ "profile.username": userName });

  return !accounts_exist && !users_exist ? true : false;
}

import getAccountById from "../utils/getAccountById.js";
export default {


    async wonByInfo(parent, args, context, info) {
      let account=await getAccountById(context,parent.wonBy)
      return {
        name: account?account.name
        ? account.name
        : account.profile.name
        ? account.profile.name
        : account.username
        ? account.username
        : account.profile.username
        ? account.profile.username
        : "Anonymous"
        : "Anonymous",
        image:account? account.profile.picture:null,
      };
    },
    async lostByInfo(parent, args, context, info) {
      let account= await getAccountById(context,parent.lostBy)

      return {
        name: account?account.name
          ? account.name
          : account.profile.name
          ? account.profile.name
          : account.username
          ? account.username
          : account.profile.username
          ? account.profile.username
          : "Anonymous"
          : "Anonymous"
          ,
        image:account? account.profile.picture:null,
      };
    },
};

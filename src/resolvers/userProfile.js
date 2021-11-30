import getFollows from "../utils/getFollows.js"

export default {
async follower(parent,args,context,info){
    let followers=await getFollows(context,{userId:parent.userId,lookFor:parent.followerData});
    return followers;
},
async following(parent,args,context,info){
    let followers=await getFollows(context,{userId:parent.userId,lookFor:parent.followingData});
    return followers;
}
}

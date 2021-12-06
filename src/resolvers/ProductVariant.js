import getProductbyId from "../utils/getProductbyId.js";
export default {
  async slug(parent, args, context, info) {
    console.log(parent);
    let catlaog_product =await getProductbyId(context,{productId:parent.ancestors[0]});
    return catlaog_product.product?catlaog_product.product.slug:null;
  }  

};

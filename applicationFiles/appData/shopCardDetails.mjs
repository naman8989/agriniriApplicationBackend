
import { resolve } from "url"
import mongoInstance from "../database/mongoDatabase.mjs"
import { rejects } from "assert"
import { resolveObjMapThunk } from "graphql"


export async function createShopCartDetails(jsonData) {
  if (!jsonData.uniqueId) {
    return [{
      status: 400,
      response: "Shopkeeper UniqueId not present. Login First!"
    }];
  }
  const mongodb = new mongoInstance(jsonData.uniqueId);
  
  try {
      
      // Check if collection already has productDetails
    const doesExist = await mongodb.findAllData({ productDetails: { $exists: true } });
      
    // console.log("allData mongo -> ", doesExist.length);
    if (doesExist.length === 0 ) {
      const insertData = {
        productDetails: jsonData.productDetails ,
        shopPastOrders: jsonData.shopPastOrderData 
      };

      // Insert initial document
      await mongodb.insertData(insertData);
    }

    // await mongodb.close();

    return [{
      uniqueId: jsonData.uniqueId,
      productData: jsonData.productData || null,
      shopPastOrderData: jsonData.shopPastOrderData || null,
      status: 200,
      response: "Collection created"
    }];

  } catch (e) {
    console.error("Error in createShopCartDetails ->", e);
    await mongodb.close();
    return [{
      status: 400,
      response: "Problem in creating your account. Try again later!"
    }];
  }
}


import mongoInstance from "../database/mongoDatabase.mjs"


export async function createShopCartDetails(jsonData) {
    try{
        if(!jsonData.uniqueId){
            return [{
                status:400,
                response: "Shopkeeper UniqueId not present. Login First!"
            }]
        }
        let mongodb = new mongoInstance(jsonData.uniqueId)
        let insertData = {productDetails:null,shopPastOrders:null}
        if (jsonData.productDetails){
            insertData.productDetails = jsonData.productDetails 
        }
        if (jsonData.shopPastOrders){
            insertData.shopPastOrders = jsonData.shopPastOrderData
        }
        await mongodb.insertData(insertData)

        mongodb.close()

        return [{
            uniqueId:jsonData.uniqueId,
            productData:jsonData.productData,
            shopPastOrderData:jsonData.shopPastOrderData,
            status:200,
            response:"Collection created"
        }]

    }catch(e){
        console.log("e -> ",e)
        return [{
            status:400,
            response:"Problem in creating your account. Try again later!"
        }]
    }

}
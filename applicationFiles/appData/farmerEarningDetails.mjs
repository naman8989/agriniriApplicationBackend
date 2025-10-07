import mongoInstance from "../database/mongoDatabase.mjs"


export async function createFarmerEarningDetails(jsonData) {
    try{
        if(!jsonData.uniqueId){
            return [{
                status:400,
                response: "Farmer UniqueId not present. Login First!"
            }]
        }
        let mongodb = new mongoInstance(jsonData.uniqueId)
        let insetData = {productDetails:null,farmerPastEarning:null}
        if (jsonData.productDetails){
            insetData.productDetails = jsonData.productDetails 
        }
        if (jsonData.farmerPastEarning){
            insetData.farmerPastEarning = jsonData.farmerPastEarningData
        }
        await mongodb.insertData(insetData)
        mongodb.close()

        return [{
            uniqueId: jsonData.uniqueId,
            productData:jsonData.productData,
            farmerPastEarningData: jsonData.farmerPastEarningData,
            status:200,
            response:"Collection created"
        }]

    }catch(e){
        return [{
            status:400,
            response:"Problem in creating your account. Try again later!"
        }]
    }

}
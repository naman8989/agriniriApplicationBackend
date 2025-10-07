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
        try {
      
            // Check if collection already has productDetails
            const doesExist = await mongodb.findAllData({ productDetails: { $exists: true } });
            
            // console.log("allData mongo -> ", doesExist.length);
            if (doesExist.length === 0 ) {
                const insertData = {
                    productDetails: jsonData.productDetails ,
                    farmerPastEarningData: jsonData.farmerPastEarningData 
                };

                // Insert initial document
                await mongodb.insertData(insertData);
            }

            // await mongodb.close();

            return [{
            uniqueId: jsonData.uniqueId,
            productData: jsonData.productData || null,
            farmerPastEarningData: jsonData.farmerPastEarningData || null,
            status: 200,
            response: "Collection created"
            }];

        } catch (e) {
            console.error("Error in FarmerEarningDetails ->", e);
            await mongodb.close();
            return [{
            status: 400,
            response: "Problem in creating your account. Try again later!"
            }];
        }

    }catch(e){
        return [{
            status:400,
            response:"Problem in creating your account. Try again later!"
        }]
    }

}
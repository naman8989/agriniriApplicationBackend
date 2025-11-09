import dbInstance from '../database/sqlDatabase.mjs';
import mongoInstance from '../database/mongoDatabase.mjs';
const db = new dbInstance('shopDetails');

export async function createShopDetails(jsonData){
    try{
        if (jsonData.uniqueId == undefined ) {
            return[{
                status : 400,
                response : `Shopkeeper Unique Id not present. Login First.`
            }]
        }
        const foundUser = await db.findInColumn("uniqueId", jsonData.uniqueId);
        // console.log("user - > ",foundUser,jsonData.uniqueId)
        if (foundUser[1].length > 0) {
            return [{status: 409 , response : "Some data is already there update the data"}]
        }

        // Extract fields from jsonData
        const fields = [
            'uniqueId',
            'shopkeeperName',
            'phoneNumber',
            'shopName',
            'panOwnerName',
            'panNumber',
            'frontPanImage',
            'googleLocation',
            'shopAddress',
            'pinCode',
            'businessType',
            'deliveryTime',
            'gst',
            'referralCode',
        ];

        const values = fields.map(field => jsonData[field]);

        // Insert data
        const res = await db.insertData(fields, values);

        
        return [{
            status : 200,
            response : "Data stored",
            uniqueId : res['uniqueId'],
            phoneNumber : res['phoneNumber'],
            shopName : res['shopName'],
            panOwnerName : res['panOwnerName'],
            panNumber : res['panNumber'],
            frontPanImage : res['frontPanImage'],
            googleLocation : res['googleLocation'],
            shopAddress : res['shopAddress'],
            pinCode : res['pinCode'],
            businessType : res['businessType'],
            deliveryTime : res['deliveryTime'],
            gst : res['gst'],
            referralCode : res['referralCode'],
            shopkeeperName : res['shopkeeperName'],
        }]
    } catch(err){
        console.error(err);
        // res.json({success: false, message: 'Error storing shop details', error: err.toString()});
        return [{
            status : 400,
            response : "Error storing shop details. Try again later!"
        }]

    }
}


    // phoneNum,shopName,panName,panNum,panImage,googleLocation,shopAddress,pinCode,businesstype,timing,gstNumber,refferalCode
    // send all this to mongodb

export async function storeShopDetailsMongo(req, res, data) {
    try {
        // Check if uniqueId exists in SQL database
        const sqlResult = await db.findInColumn("uniqueId", data.uniqueId);
        if (!sqlResult || sqlResult.length === 0) {
            res.statusCode = 404;
            res.json({ response: "uniqueId not found in SQL database" });
            return;
        }

        // Store shop details in MongoDB
        const mongoDb = new mongoInstance(data.uniqueId);
        const insertResult = await mongoDb.insertData(data.shopData);

        res.json({ success: true, message: "Shop details stored in MongoDB", insertResult });
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({ success: false, message: "Error storing shop details", error: err.toString() });
    }
}

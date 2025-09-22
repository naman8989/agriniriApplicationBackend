import dbInstance from '../database/sqlDatabase.mjs';

const db = new dbInstance('shopDetails');

export async function getShopDetails(req,res,jsonData){
    if (req == undefined || jsonData == undefined ) {
        res.json({ 'response': `Email, Password or name not present` })
        // console.log((req  != undefined ), (email  != undefined ),( password  != undefined))
        return
    }
    try{

        // Extract fields from jsonData
        const fields = [
            'uniqueId',
            'phoneNumber',
            'shopName',
            'panOwnerName',
            'panNumber',
            'frontPanImage',
            'googleLocation',
            'shopAddress',
            'pinCode',
            'businessType',
            'deliveryTime'
        ];

        const values = fields.map(field => jsonData[field]);

        // Insert data
        const result = await db.insertData(fields, values);

        res.json({success: true, message: result});
        db.close();
    } catch(err){
        console.error(err);
        res.json({success: false, message: 'Error storing shop details', error: err.toString()});
    }
}
    // phoneNum,shopName,panName,panNum,panImage,googleLocation,shopAddress,pinCode,businesstype,timing,gstNumber,refferalCode
    // send all this to mongodb

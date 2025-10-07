// const { response } = require("express")
// const sqlInstance = require("../database/sqlDatabase.cjs")

import dbInstance from '../database/sqlDatabase.mjs';
import mongoInstance from "../database/mongoDatabase.mjs";

const db = new dbInstance('farmerDetails');

export async function createFarmerDetails(jsonData){
    try{
        if (jsonData.uniqueId == undefined ) {
            return [{ status : 400, response : `Farmer Unique Id not present. Login First.` }]
        }
        const foundUser = await db.findInColumn("uniqueId", jsonData.uniqueId);
        // console.log("user - > ",foundUser,jsonData.uniqueId)
        if (foundUser[1].length > 0) {
            return [{status: 409 , response : "Some data is already there update the data"}]
        }

        const fields = [
            'uniqueId',
            'farmerName',
            'phoneNumber',
            'address',
            'cropType',
            'landSize',
            'experience',
            'googleLocation',
            'addharImage',
            'referalCode'
        ];
        
        console.log("in here")
        const values = fields.map(field => jsonData[field]);
        const res = await db.insertData(fields, values);
    

        // create collectiokn

        // res.json({success: true, message: result});
        // db.close();
        return [{

            status : 200,
            response : "Data saved",
            uniqueId : jsonData['uniqueId'],
            farmerName : jsonData['farmerName'],
            phoneNumber : jsonData['phoneNumber'],
            address : jsonData['address'],
            cropType : jsonData['cropType'],
            farmSize : jsonData['farmSize'],
            experience : jsonData['experience'],
            googleLocation : jsonData['googleLocation'],
            addharImage : jsonData['addharImage'],
            referalCode : jsonData['referalCode'],
        }]
    } catch(err){
        console.error(err);
        // ({success: false, message: 'Error storing farmer details', error: err.toString()});
        return[{
            status : 400,
            response : "Error storing farmer details. Try again later!"
        }]
    }
}


export async function storeFarmerDetailsMongo(req, res, body) {
    try {
        if(!body.name || !body.price || !body.description || !body.quality || !body.location || (!body.min && !body.mul) || !body.ProImage ){
            res.statusCode = 400
            res.json({"response":"Some detail is missing. "})
        }

        const sqlDb = new dbInstance("farmerDetails");
        const result = await sqlDb.findInColumn("uniqueId", req.body.uniqueId);

        if (!result || result.length === 0) {
            res.statusCode = 404;
            res.json({ response: "Please complete the details before adding the products." });
            return;
        }

        // Insert into mongoDatabase with collection name = uniqueId
        const mongoDb = new mongoInstance(req.body.uniqueId);
        await mongoDb.insertData(body.farmerData).then((value)=>{
            if(value['success']==true){
                res.statusCode = 200;
                res.json({
                    success: true,
                    message: "Product details stored in mongoDatabase",
                });
            }else{
                res.statusCode == 200;
                res.json({
                    success:false,
                    message: "Details not stored. Try again later! "
                })
            }
        })
        // Close DBs
        db.close();
        mongoDb.close();

    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.json({
            success: false,
            message: "Error storing farmer details in mongoDatabase",
            error: err.toString(),
        });
    }
}


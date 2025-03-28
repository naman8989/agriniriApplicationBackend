const { response } = require("express")
const sqlInstance = require("../database/sqlDatabase.cjs")

async function putUserAddressInformation(req,res,jsonData){
    console.log(jsonData)
    const addressDb = new sqlInstance("userAddressInformation")
    dataRes = await addressDb.insertData(["name","address","email","phone","zipCode","googleMapLocation"],[jsonData.name,jsonData.address,jsonData.email,jsonData.phone,jsonData.zipCode,jsonData.googleMapLocation])
    res.status(200).send({response:dataRes})
    // res.end("ok got it in addressInformation")
    // console.log(jsonData)
    // dataRes = await addressDb.insertData(["name","address","email","phone","zipCode","googleMapLocation"],)
}

async function  getUserAddressInformation(req,res,jsonData) {
    const addressDb = new sqlInstance("userAddressInformation")
    dataRes = await  addressDb.getAllData("SELECT * FROM userAddressInformation "+`LIMIT ${jsonData.limit} OFFSET ${jsonData.offset}`)
    
    // console.log(jsonData)
    // dataRes = await addressDb.getAllData("SELECT * FROM addressInformation",limit=jsonData.limit,offset=jsonData.offset)
    res.status(200).send({response:dataRes})
    // res.end("ok got in address get")
    
}

module.exports = {putUserAddressInformation,getUserAddressInformation}
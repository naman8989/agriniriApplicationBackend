// import dbInstance from "../database/sqlDatabase.cjs"
const { json } = require("body-parser");
const sqlInstance = require("../database/sqlDatabase.cjs")


async function insertFaqDetails(req, res, jsonData){
    const faqDb =  new sqlInstance("faqDetails")
    console.log(jsonData.question,jsonData.answer);
    dataRes = await faqDb.insertData(["question","answer"],[jsonData.question,jsonData.answer])
    // console.log(jsonData);
    res.status(200).send({response:dataRes});
    faqDb.close();
}

async function getFaqDetails(req, res, jsonData) {
    const faqDb = new sqlInstance("faqDetails")
    dataRes = await  faqDb.getAllData("SELECT * FROM faqDetails "+`LIMIT ${jsonData.limit} OFFSET ${jsonData.offset}`)
    // console.log(jsonData);
    // console.log("res:\n",dataRes)
    res.status(200).send({response:dataRes});
    faqDb.close();
}



module.exports = {insertFaqDetails,getFaqDetails};
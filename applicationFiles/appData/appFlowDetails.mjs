import dbInstance from '../database/sqlDatabase.mjs';
import mongoInstance from '../database/mongoDatabase.mjs';

const productInfoDatabase = new dbInstance('productDetails');
const orderInfoDatabase = new dbInstance('orderDetails');
const earningInfoDatabase = new dbInstance('earningDetails');


function generateBase64Id(email, password) {
  // Combine the username and password into a string (you can add a separator if needed)
  const combined = password + ':' + email; // Example: "username:password"

  // Convert the combined string to Base64
  const base64Id = Buffer.from(combined).toString('base64');

  return base64Id;
}

export async function createProductDetails(jsonData) {
    try{
        if (jsonData.uniqueId == undefined ) { 
            return[{
                status : 400,
                response : `Farmer Unique Id not present. Login First.`
            }]
        }
        jsonData.productId = generateBase64Id(jsonData.uniqueId,jsonData.productName)
        const fields = [
            'uniqueId',
            'productId',
            'productName',
            'productPrice',
            'productDesc',
            'productRating',
            'locationDetail',
            'productImage',
            'productQuantityAvaliable',
            'productQuantityUsed',
            'minOrderReq',
            'MultipleOrderRequest'
        ]

        console.log("in here")
        let values = fields.map(field => jsonData[field])
        
        let mongodb = new mongoInstance(jsonData.uniqueId)
        console.log("mg -> ",mongodb)
        // console.log("userData -> ",userData)
        // console.log("userData -> ",userData.productDetails)
        userData.productData.push(jsonData)
         
        mongodb.insertData(userData)
        let res = await productInfoDatabase.insertData(fields, values);

        return [{
            status: 200,
            response: "Data Stored",
            uniqueId: jsonData.uniqueId,
            productId: jsonData.productId,
            productName: jsonData.productName,
            productPrice: jsonData.productPrice,
            productDesc: jsonData.productDesc,
            productRating: jsonData.productRating,
            locationDetail: jsonData.locationDetail,
            productImage: jsonData.productImage,
            productQuantityAvaliable: jsonData.productQuantityAvaliable,
            productQuantityUsed: jsonData.productQuantityUsed,
            minOrderReq: jsonData.minOrderReq,
            MultipleOrderRequest: jsonData.MultipleOrderRequest

        }]

    }catch(e){
        console.log("e -> ",e)
        return [{
            status : 400,
            response : "Error storing shop details. Try again later!"
        }]
    }
}


export async function createOrderInfo(jsonData) {
    try{
        if (jsonData.uniqueId == undefined ) { 
            return[{
                status : 400,
                response : `Farmer Unique Id not present. Login First.`
            }]
        }
        if (jsonData.productId == undefined ) { 
            return[{
                status : 400,
                response : `Product Id not present. Login First.`
            }]
        }
        jsonData.orderId = generateBase64Id(jsonData.uniqueId,jsonData.productId)
        const fields = [
            'uniqueId',
            'productId',
            'orderId',
            'paymentId',
            'totalAmount',
            'paymentStatus',
            'shipmentStatus',
            'quantiyGetting',
            'shipmentInfo',
            'paymentMethod'
        ]

        let values = fields.map(field => jsonData[field])

        let mongodb = new mongoInstance(jsonData.uniqueId)
        userData = mongodb.findData(jsonData.uniqueId)
        userData.shopPastOrderData.push(jsonData)
         
        mongodb.insertData(userData)
        let res = await orderInfoDatabase.insertData(fields, values);

        return [{
            status: 200,
            response: "Data Stored",
            uniqueId: jsonData.uniqueId,
            productId: jsonData.productId,
            orderId: jsonData.orderId,
            paymentId: jsonData.paymentId,
            totalAmount: jsonData.totalAmount,
            paymentStatus: jsonData.paymentStatus,
            shipmentStatus: jsonData.shipmentStatus,
            quantiyGetting: jsonData.quantiyGetting,
            shipmentInfo: jsonData.shipmentInfo,
            paymentMethod: jsonData.paymentMethod,
        }]

    }catch(e){
        return [{
            status : 400,
            response : "Error storing order details. Try again later!"
        }]
    }
}

export async function createEarningInfo(jsonData){
    try{
        if (jsonData.uniqueId == undefined ) { 
            return[{
                status : 400,
                response : `Farmer Unique Id not present. Login First.`
            }]
        }
        if (jsonData.productId == undefined ) { 
            return[{
                status : 400,
                response : `ProductId not present. Login First.`
            }]
        }
        if (jsonData.orderId == undefined ) { 
            return[{
                status : 400,
                response : `OrderId not present. Login First.`
            }]
        }
        jsonData.earningId = generateBase64Id(jsonData.uniqueId,jsonData.productId)
        const fields = [
            'earningId',
            'uniqueId',
            'productId',
            'orderId',
            'paymentId',
            'MoneyEarningStatus',
            'ProductShipmentStatus',
            'shipmentInfo',
            'paymentMethod',
            'amount'
        ]

        let values = fields.map(field => jsonData[field])
        console.log("in here")
        let mongodb = new mongoInstance(jsonData.uniqueId)
        userData = mongodb.findData(jsonData.uniqueId)
        userData.farmerPastEarningData.push(jsonData)
         
        mongodb.insertData(userData)
        let res = await earningInfoDatabase.insertData(fields, values);
        return [{
            status:200,
            response:"Data Stored",
            earningId:jsonData.earningId,
            uniqueId:jsonData.uniqueId,
            productId:jsonData.productId,
            orderId:jsonData.orderId,
            paymentId:jsonData.paymentId,
            MoneyEarningStatus:jsonData.MoneyEarningStatus,
            ProductShipmentStatus:jsonData.ProductShipmentStatus,
            shipmentInfo:jsonData.shipmentInfo,
            paymentMethod:jsonData.paymentMethod,
            amount:jsonData.amount
        }]

    }catch(e){
        return [{
            status : 400,
            response : "Error storing earning info details. Try again later!"
        }]
    }
}
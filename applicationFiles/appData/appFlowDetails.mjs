import dbInstance from '../database/sqlDatabase.mjs';
import mongoInstance from '../database/mongoDatabase.mjs';
import { response } from 'express';

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
        if (jsonData.farmerUniqueId == undefined ) { 
            return[{
                status : 400,
                response : `Farmer Unique Id not present. Login First.`
            }]
        }
        // jsonData.productId = generateBase64Id(jsonData.farmerUniqueId,jsonData.productName)
        const fields = [
            'farmerUniqueId',
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
            'live',
            'MultipleOrderRequest'
        ]

        let values = fields.map(field => jsonData[field])

        const res = await productInfoDatabase.insertData(fields,values)
        
        return [{
            status: 200,
            response: "Data Stored",
            farmerUniqueId : jsonData['farmerUniqueId'],
            productId : jsonData['productId'],
            productName : jsonData['productName'],
            productPrice : jsonData['productPrice'],
            productDesc : jsonData['productDesc'],
            productRating : jsonData['productRating'],
            locationDetail : jsonData['locationDetail'],
            productImage : jsonData['productImage'],
            productQuantityAvaliable : jsonData['productQuantityAvaliable'],
            productQuantityUsed : jsonData['productQuantityUsed'],
            minOrderReq : jsonData['minOrderReq'],
            MultipleOrderRequest : jsonData['MultipleOrderRequest'],
        }]
        // let mongodb = new mongoInstance(jsonData.farmerUniqueId)
        

        // const doesExist = await mongodb.findAllData({ productDetails: { $exists: true } });
        // // console.log("allData mongo -> ", doesExist.length);
        // if (doesExist.length === 0 ) {
        //     return [{
        //         status : 400,
        //         response : "Product detail in collection not found"
        //     }]
        // }else{
        //     // console.log(doesExist,doesExist[0]._id)    
        //     doesExist[0].productDetails.push({
        //         'uniqueId' :jsonData['uniqueId'] ,
        //         'productId' :jsonData['productId'] ,
        //         'productName' :jsonData['productName'] ,
        //         'productPrice' :jsonData['productPrice'] ,
        //         'productDesc' :jsonData['productDesc'] ,
        //         'productRating' :jsonData['productRating'] ,
        //         'locationDetail' :jsonData['locationDetail'] ,
        //         'productImage' :jsonData['productImage'] ,
        //         'productQuantityAvaliable' :jsonData['productQuantityAvaliable'] ,
        //         'productQuantityUsed' :jsonData['productQuantityUsed'] ,
        //         'minOrderReq' :jsonData['minOrderReq'] ,
        //         'MultipleOrderRequest' :jsonData['MultipleOrderRequest'] ,                
        //     })

        //     await mongodb.updateData({_id:doesExist[0]._id},doesExist[0])

        //     return [{
        //         status: 200,
        //         response: "Data Stored",
        //         uniqueId: jsonData.uniqueId,
        //         productId: jsonData.productId,
        //         productName: jsonData.productName,
        //         productPrice: jsonData.productPrice,
        //         productDesc: jsonData.productDesc,
        //         productRating: jsonData.productRating,
        //         locationDetail: jsonData.locationDetail,
        //         productImage: jsonData.productImage,
        //         productQuantityAvaliable: jsonData.productQuantityAvaliable,
        //         productQuantityUsed: jsonData.productQuantityUsed,
        //         minOrderReq: jsonData.minOrderReq,
        //         MultipleOrderRequest: jsonData.MultipleOrderRequest
        //     }]
        // }


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
        // console.log("in here ",jsonData)
        if (jsonData.orderId == undefined ) { 
            return[{
                status : 400,
                response : `Order Id not present. Login First.`
            }]
        }
        if (jsonData.productId == undefined ) { 
            return[{
                status : 400,
                response : `Product Id not present. Login First.`
            }]
        }
        // jsonData.orderId = generateBase64Id(jsonData.uniqueId,jsonData.productId)
        const fields = [
            'orderId',
            'shopUniqueId',
            'paymentId',
            'totalAmount',
            'accoragement',
            'paymentStatus',
            'paymentMethod',
            'shipmentStatus',
            'shipmentInfo',
            'quantityGetting',
            'productId',
        ]

        let values = fields.map(field => jsonData[field])

        const res = await orderInfoDatabase.insertData(fields,values)

        return[{
            status: 200,
            response: "Data Stored",
            orderId: jsonData['orderId'],
            shopUniqueId: jsonData['shopUniqueId'],
            paymentId: jsonData['paymentId'],
            totalAmount: jsonData['totalAmount'],
            accoragement: jsonData['accoragement'],
            paymentStatus: jsonData['paymentStatus'],
            paymentMethod: jsonData['paymentMethod'],
            shipmentStatus: jsonData['shipmentStatus'],
            shipmentInfo: jsonData['shipmentInfo'],
            quantityGetting: jsonData['quantityGetting'],
            productId: jsonData['productId'],
        }]

        // let mongodb = new mongoInstance(jsonData.uniqueId)
        // console.log(mongodb)
        
        // const doesExist = await mongodb.findAllData({ shopPastOrders: { $exists: true } });
        // console.log("allData mongo -> ", doesExist.length);
        // if (doesExist.length === 0 ) {
        //     return [{
        //         status : 400,
        //         response : "Shop collection not found"
        //     }]
        // }else{
        //     // console.log(doesExist,doesExist[0]._id)    
        //     doesExist[0].productDetails.push({
        //         'uniqueId' :jsonData['uniqueId'] ,
        //         'productId' :jsonData['productId'] ,
        //         'orderId' :jsonData['orderId'] ,
        //         'paymentId' :jsonData['paymentId'] ,
        //         'totalAmount' :jsonData['totalAmount'] ,
        //         'paymentStatus' :jsonData['paymentStatus'] ,
        //         'shipmentStatus' :jsonData['shipmentStatus'] ,
        //         'quantiyGetting' :jsonData['quantiyGetting'] ,
        //         'shipmentInfo' :jsonData['shipmentInfo'] ,
        //         'paymentMethod' :jsonData['paymentMethod'] ,
        //     })

        //     await mongodb.updateData({_id:doesExist[0]._id},doesExist[0])

        //     return [{
        //         status: 200,
        //         response: "Data Stored",
        //         uniqueId: jsonData.uniqueId,
        //         productId: jsonData.productId,
        //         orderId: jsonData.orderId,
        //         paymentId: jsonData.paymentId,
        //         totalAmount: jsonData.totalAmount,
        //         paymentStatus: jsonData.paymentStatus,
        //         shipmentStatus: jsonData.shipmentStatus,
        //         quantiyGetting: jsonData.quantiyGetting,
        //         shipmentInfo: jsonData.shipmentInfo,
        //         paymentMethod: jsonData.paymentMethod,
        //     }]
        // }

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

        let mongodb = new mongoInstance(jsonData.uniqueId)
        // console.log(mongodb)
        
        const doesExist = await mongodb.findAllData({ farmerPastEarningData: { $exists: true } });
        // console.log("allData mongo -> ", doesExist.length);
        if (doesExist.length === 0 ) {
            return [{
                status : 400,
                response : "Shop collection not found"
            }]
        }else{
            // console.log(doesExist,doesExist[0]._id)    
            doesExist[0].productDetails.push({
                'earningId' :jsonData['earningId'] ,
                'uniqueId' :jsonData['uniqueId'] ,
                'productId' :jsonData['productId'] ,
                'orderId' :jsonData['orderId'] ,
                'paymentId' :jsonData['paymentId'] ,
                'MoneyEarningStatus' :jsonData['MoneyEarningStatus'] ,
                'ProductShipmentStatus' :jsonData['ProductShipmentStatus'] ,
                'shipmentInfo' :jsonData['shipmentInfo'] ,
                'paymentMethod' :jsonData['paymentMethod'] ,
                'amount' :jsonData['amount'] ,
            })

            await mongodb.updateData({_id:doesExist[0]._id},doesExist[0])

            return [{
                status: 200,
                response: "Data Stored",
                earningId: jsonData.earningId,
                uniqueId: jsonData.uniqueId,
                productId: jsonData.productId,
                orderId: jsonData.orderId,
                paymentId: jsonData.paymentId,
                MoneyEarningStatus: jsonData.MoneyEarningStatus,
                ProductShipmentStatus: jsonData.ProductShipmentStatus,
                shipmentInfo: jsonData.shipmentInfo,
                paymentMethod: jsonData.paymentMethod,
                amount: jsonData.amount,
            }]
        }

    }catch(e){
        return [{
            status : 400,
            response : "Error storing earning info details. Try again later!"
        }]
    }
}

import dbInstance from "./sqlDatabase.mjs"
let userData = new dbInstance("users")
let farmerDetail = new dbInstance("farmerDetails")
let shopDetails = new dbInstance("shopDetails")
import bcrypt, { compareSync } from "bcryptjs";


export async function getUser(jsonData) {
    // console.log("jsonData :- ",jsonData,jsonData['searchPoint'],jsonData['searchPoint'] != null)
    let userInfo = [{ status: 400, response: "Search Point not Present" }]
    try{
        if(jsonData['searchPoint'] == null){
            userInfo[0]['response'] = "Search Point not Present"
            return userInfo
        }
        let sp = jsonData['searchPoint']
        
        let currentUserData =  await userData.findInColumn(jsonData['searchPoint'],jsonData[sp])
        // console.log(currentUserData[1])
        if(currentUserData[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Please create a new account !'
            return userInfo
        }
        // console.log(" in here ",jsonData['searchPoint'],jsonData[sp],currentUserData[1][0]['hashedPassword'])
        currentUserData[1].forEach(element => {
            element['status'] = 200
            element['response'] = "Got the data"
        });
        // currentUserData[1]['status'] = 200
        // currentUserData[1]['response'] = "Got the data"
        // userInfo[0]['status'] = 200
        // userInfo[0]['response'] = "Got the data"

        // userInfo[0]['name'] = currentUserData[1][0]['name']
        // userInfo[0]['emailPhone'] = currentUserData[1][0]['emailPhone']
        // userInfo[0]['uniqueId'] = currentUserData[1][0]['uniqueId']
        // userInfo[0]['hashPassword'] = currentUserData[1][0]['hashedPassword'] 
        // userInfo[0]['retoken'] = currentUserData[1][0]['retoken']
        // userInfo[0]['occupation'] = currentUserData[1][0]['occupation']
        // userInfo[0]['kycStatus'] = currentUserData[1][0]['kycStatus']
        return currentUserData[1]
        // return userInfo
    

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
    return userInfo

}

export async function updateUser(jsonData) {
    let userInfo = [{ status: 400, response: "Search Point not Present" }]
    try{
        
        if(jsonData['searchPoint'] == null){
            userInfo[0]['response'] = "Search Point not Present"
            return userInfo
        }
        if(jsonData['searchValue'] == null){
            userInfo[0]['response'] = "Search Value not Present"
            return userInfo
        }
        if(jsonData['updatePoint'] == null){
            userInfo[0]['response'] = "Update Point not Present"
            return userInfo
        }
        if(jsonData['updateData'] == null){
            userInfo[0]['response'] = "Update data not Present"
            return userInfo
        }
        console.log('in here')
        console.log(jsonData['searchPoint'],jsonData['updatePoint'],jsonData['updateData'])
        // let sp = jsonData['searchPoint']

        let currentUserData =  await userData.findInColumn(jsonData['searchPoint'],jsonData['searchValue'])
        // console.log(currentUserData[1].length)
        if(currentUserData[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Please create a new account !'
            return userInfo
        }
        // console.log(" in here ",jsonData['searchPoint'],jsonData[sp],currentUserData[1][0]['hashedPassword'])

        if(jsonData['updatePoint'] == 'hashedPassword' ){
            jsonData['updateData'] = await bcrypt.hash(jsonData['updateData'],global.passwordSaltRound)
        }
        let currentUpdate = await userData.updateUsers([jsonData['searchPoint'],jsonData['searchValue']],[[jsonData['updatePoint'],jsonData['updateData']]]);

        userInfo[0]['status'] = 200
        userInfo[0]['response'] = "Updated!"

        return userInfo

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
    return userInfo

}

export async function deleteUser(jsonData){


}


// kyc details 
export async function getKycStatus(jsonData,checkFor) {
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        
        if(jsonData['uniqueId'] == null){
            userInfo[0]['response'] = "uniqueId not Present"
            return userInfo
        }

        let currentKycDetails = null
        if(checkFor == "Farmer"){
            currentKycDetails = await farmerDetail.findInColumn("uniqueId",jsonData['uniqueId'])
        }else{
            currentKycDetails = await shopDetails.findInColumn("uniqueId",jsonData['uniqueId'])
        }
        if(currentKycDetails[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Kyc status might be 0. '
            return userInfo
        }

        currentKycDetails[1].forEach(element=>{
            element['status'] = 200
            element['response'] = "Got the data"
        })
        return currentKycDetails[1]

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}

export async function updateFarmerDetails(jsonData){
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        console.log('in here')
        
        if(jsonData['uniqueId'] == null){
            userInfo[0]['response'] = "uniqueId not Present"
            return userInfo
        }

        let currentFarmDetail = null 
        currentFarmDetail = await farmerDetail.findInColumn("uniqueId",jsonData['uniqueId'])
        if(currentFarmDetail[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Kyc status might be 0. '
            return userInfo
        }

        currentFarmDetail = await farmerDetail.updateUsers(["uniqueId", jsonData['uniqueId']], Object.entries(jsonData))

        currentFarmDetail[1].forEach(element=>{
            element['status'] = 200
            element['response'] = "Got the data"
        })
        return currentFarmDetail[1]

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}

export async function updateShopkeeperDetails(jsonData){
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        
        if(jsonData['uniqueId'] == null){
            userInfo[0]['response'] = "uniqueId not Present"
            return userInfo
        }

        let currentShopkeeperDetails = null 
        currentShopkeeperDetails = await shopDetails.findInColumn("uniqueId",jsonData['uniqueId'])
        if(currentShopkeeperDetails[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Kyc status might be 0. '
            return userInfo
        }

        currentShopkeeperDetails = await shopDetails.updateUsers(["uniqueId", jsonData['uniqueId']], Object.entries(jsonData))

        currentShopkeeperDetails[1].forEach(element=>{
            element['status'] = 200
            element['response'] = "Got the data"
        })
        return currentShopkeeperDetails[1]

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}

const productInfoDatabase = new dbInstance('productDetails');
export async function getProductInfo(jsonData){
    
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        
        if(jsonData['productId'] == null){
            userInfo[0]['response'] = "uniqueId not Present"
            return userInfo
        }

        let currentProductInfo = await productInfoDatabase.findInColumn("productId",jsonData['productId'])
        if(currentProductInfo[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Kyc status might be 0. '
            return userInfo
        }

        currentProductInfo[1].forEach(element=>{
            element['status'] = 200
            element['response'] = "Got the data"
        })
        return currentProductInfo[1]


    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}

export async function  updateProductDetails(jsonData) {
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        
        if(jsonData['productId'] == null){
            userInfo[0]['response'] = "uniqueId not Present"
            return userInfo
        }

        let currentProductDetails = await productInfoDatabase.findInColumn("productId",jsonData['productId'])
        if(currentProductDetails[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Kyc status might be 0. '
            return userInfo
        }

        let change = await productInfoDatabase.updateUsers(["productId",jsonData["productId"]], Object.entries(jsonData) )
        
        if(change['changes'] != 1){
            userInfo[0]['status'] = 400
            userInfo[0]['retoken'] = "Change is not made"
            return userInfo[0]
        }
        
        currentProductDetails[1].forEach(element=>{
            element['status'] = 200
            element['response'] = 'Got the data'
        })
        return currentProductDetails[1];

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}



// for order info
const orderInfoDatabase = new dbInstance('orderDetails');
export async function getOrderInfo(jsonData){
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        
        if(jsonData['orderId'] == null){
            userInfo[0]['response'] = "OrderId not Present"
            return userInfo
        }

        let currentOrderInfo = await orderInfoDatabase.findInColumn("orderId",jsonData['orderId'])
        if(currentOrderInfo[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. Kyc status might be 0. '
            return userInfo
        }

        currentOrderInfo[1].forEach(element=>{
            element['status'] = 200
            element['response'] = "Got the data"
        })
        return currentOrderInfo[1]

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}

export async function updateOrderInfo(jsonData){
    let userInfo = [{ status: 400, response: "uniqueId not Present" }]
    try{
        
        if(jsonData['orderId'] == null){
            userInfo[0]['response'] = "orderId not Present"
            return userInfo
        }

        let currentOrderDetails = null 
        currentOrderDetails = await orderInfoDatabase.findInColumn("orderId",jsonData['orderId'])
        if(currentOrderDetails[1].length <= 0){
            userInfo[0]['status'] = 400
            userInfo[0]['response'] = 'Account not found. '
            return userInfo
        }
        
        let change = await orderInfoDatabase.updateUsers(["orderId",jsonData["orderId"]], Object.entries(jsonData) )
        if(change['changes'] != 1){
            userInfo[0]['status'] = 400
            userInfo[0]['retoken'] = "Change is not made"
            return userInfo[0]
        }

        currentOrderDetails[1].forEach(element=>{
            element['status'] = 200
            element['response'] = "Got the data"
        })
        return currentOrderDetails[1]

    }catch(e){
        console.log(e)
        userInfo[0]['status'] = 400
        userInfo[0]['retoken'] = "Something went wrong"
    }
}
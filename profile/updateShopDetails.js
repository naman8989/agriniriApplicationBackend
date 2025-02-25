
dataBase = require("../database/sqlDatabase")

shopDetails = new dataBase("shopDetails")

function getShopDetails(req,res,userId,phoneNumber,shopName,panOwnerName,panNumber,frontPanImage,googleLocation,shopAddress,pinCode,businessType,deliveryTime,gstNumber,refferalCode){
    
    elementsReq = [userId,phoneNumber , shopName , panOwnerName , panNumber , frontPanImage , googleLocation , shopAddress , pinCode , businessType , deliveryTime]
    for(let i=0; i<elementsReq.length; i++){
        if (e == null){
            res.status_code = 404
            res.json({ 'response': `${e} is not present`,"userId":`null` })  
            if(e=="userId"){
                return
            } 
            break
        }
    }
    
    isShopDetailPresent = shopDetails.findInColumn("uniqueId",`${userId}`)[1]
    fields = ["userId" , "phoneNumber" , "shopName" , "panOwnerName" , "panNumber" , "frontPanImage" , "googleLocation" , "shopAddress" , "pinCode" , "businessType" , "deliveryTime"]
    if(isShopDetailPresent[1]==null){
        shopDetails.insertUser(fields,elementsReq)
    }else{
        newFields=[]
        for(let i=0; i<fields; i++){
            newFields.push([fields[i],elementsReq[i]])
        }
        shopDetails.updateUser(["userId",userId],newFields)
    }
    

} 

module.exports = getShopDetails;
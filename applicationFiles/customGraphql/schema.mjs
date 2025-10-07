import { buildSchema } from "graphql";

// export const schema = buildSchema(
export const typeDefs = 
  `
  scalar Upload
  type  userPrimaryData{
    name: String
    emailPhone: String
    uniqueId: String
    hashPassword:String
    retoken: String
    occupation: occupationOptions
    kycStatus: Int
    response: String
    status: Int
  }
    
  enum occupationOptions{
    Farmer
    Shopkeeper
  }

  type userFarmDetail {
    uniqueId: String
    farmerName: String
    phoneNumber: String
    address:String
    typeOfCrop: String
    landSize: String
    yearOfExp: Int
    location: String
    addharImage: Upload
    referralCode: String
    response: String
    status: Int
  }

  type userShopDetail {
    uniqueId:String
    shopkeeperName:String
    phoneNumber: String
    shopName: String
    panName: String
    panNumber: String
    panImage: Upload
    shopLocation: String
    shopAddress: String
    areaPinCode: Int
    businessType: String
    deliveryTime: String
    gstNumber: String
    referralCode: String
    response: String
    status: Int
  }

  type productInfo {
    productId: String
    productName: String
    productPrice: Float
    productDesc: String
    productRating: Int
    locationDetail: String
    productImage: Upload
    productQuantityAvaliable: Float 
    productQuantityUsed: Float
    minOrderReq: Float
    MultipleOrderRequest: Float 
    response: String
    status: Int
  }

  type shopCart {
    uniqueId:String
    productData:[productInfo]
    shopPastOrderData:[orderInfo]
    response: String
    status: Int
  }

  type farmerEarning {
    uniqueId:String
    productData:[productInfo]
    farmerPastEarningData:[earningInfo]
    response: String
    status: Int
  }

  type orderInfo{
    uniqueId: String
    productId: String 
    orderId: String
    paymentId: String
    totalAmount: Float
    paymentStatus: String
    shipmentStatus: String
    quantiyGetting: Float
    shipmentInfo: String
    paymentMethod: String
    response: String
    status: Int
  }

  type earningInfo{
    earningId: String
    uniqueId: String
    productId: String
    orderId: String
    paymentId: String
    MoneyEarningStatus: String
    ProductShipmentStatus: String
    shipmentInfo: String
    paymentMethod: String
    amount: Float
    response: String
    status: Int
  }

  type allUserData {
    userPrimaryData: [userPrimaryData]
    userFarmDetail: [userFarmDetail]
    userShopDetail: [userShopDetail]
    userShopCart: [shopCart]
    userFarmerEarning: [farmerEarning]
    userProductInfo: [productInfo]
    userOrderInfo: [orderInfo]
    userEarningInfo: [earningInfo]
    response: String
    status: Int
  }
  
  input allUserDataInput {
    userPrimaryData: userPrimaryDataInput
    userFarmDetail: userFarmDetailInput
    userShopDetail: userShopDetailInput
    userShopCart: userShopCartInput
    userFarmerEarning: userFarmerEarningInput
    userProductInfo: userProductInfoInput
    userOrderInfo: userOrderInfoInput
    userEarningInfo: userEarningInfoInput
  }


  input userPrimaryDataInput{
    name: String
    emailPhone: String
    uniqueId: ID
    hashPassword:String
    reToken: String
    occupation: occupationOptions
    kycStatus: Int
  }

  input userFarmDetailInput {
    uniqueId: String
    farmerName: String
    phoneNumber: String
    address:String
    typeOfCrop: String
    landSize: String
    yearOfExp: Int
    location: String
    addharImage: Upload
    referralCode: String
  }

  input userShopDetailInput {
    uniqueId:String
    shopkeeperName:String
    phoneNumber: String
    shopName: String
    panName: String
    panNumber: String
    panImage: Upload
    shopLocation: String
    shopAddress: String
    areaPinCode: Int
    businessType: String
    deliveryTime: String
    gstNumber: String
    referralCode: String
  }

  input userProductInfoInput {
    uniqueId:String
    productId: String
    productName: String
    productPrice: Float
    productDesc: String
    productRating: Int
    locationDetail: String
    productImage: String
    productQuantityAvaliable: Float 
    productQuantityUsed: Float
    minOrderReq: Float
    MultipleOrderRequest: Float 
  }

  input userShopCartInput {
    uniqueId:String
    productData:[userProductInfoInput]
    shopPastOrderData:[userOrderInfoInput]
  }

  input userFarmerEarningInput {
    uniqueId:String
    productData:[userProductInfoInput]
    farmerPastEarningData:[userEarningInfoInput]
  }


  input userOrderInfoInput {
    uniqueId: String
    productId: String 
    orderId: String
    paymentId: String
    totalAmount: Float
    paymentStatus: String
    shipmentStatus: String
    quantiyGetting: Float
    shipmentInfo: String
    paymentMethod: String
  }

  input userEarningInfoInput {
    earningId: String
    uniqueId: String
    productId: String
    orderId: String
    paymentId: String
    MoneyEarningStatus: String
    ProductShipmentStatus: String
    shipmentInfo: String
    paymentMethod: String
    amount: Float
  }


type Query {
  _empty: String
}

type Mutation { 
  operateAllUserData(operation:String, input: [allUserDataInput] ):[allUserData]
}


`
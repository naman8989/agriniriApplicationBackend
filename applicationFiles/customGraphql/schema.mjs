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
    cropType: String
    landSize: String
    experience: Int
    googleLocation: String
    addharImage: Upload
    referalCode: String
    response: String
    status: Int
  }

  type userShopDetail {
    uniqueId:String
    shopkeeperName:String
    phoneNumber: String
    shopName: String
    panOwnerName: String
    panNumber: String
    frontPanImage: Upload
    googleLocation: String
    shopAddress: String
    pinCode: Int
    businessType: String
    deliveryTime: String
    gst: String
    referralCode: String
    response: String
    status: Int
  }

  type productInfo {
    farmerUniqueId:String
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
    live:String
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
    orderId:  String
    shopUniqueId:  String
    paymentId:  String
    totalAmount:  Float
    accoragement:  String
    paymentStatus:  String
    paymentMethod:  String
    shipmentStatus:  String
    shipmentInfo:  String
    quantityGetting:  Float
    productId:  String
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
    userProductInfo: productInfoInput
    userOrderInfo: orderInfoInput
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

    
    searchPoint:String
    searchValue:String
    updatePoint:String
    updateData:String
  }

  input userFarmDetailInput {
    uniqueId: String
    farmerName: String
    phoneNumber: String
    address:String
    cropType: String
    landSize: String
    experience: Int
    googleLocation: String
    addharImage: Upload
    referalCode: String
  }

  input userShopDetailInput {
    uniqueId:String
    shopkeeperName:String
    phoneNumber: String
    shopName: String
    panOwnerName: String
    panNumber: String
    frontPanImage: Upload
    googleLocation: String
    shopAddress: String
    pinCode: Int
    businessType: String
    deliveryTime: String
    gst: String
    referralCode: String
  }

  input productInfoInput {
    farmerUniqueId:String
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
    live:String
  }

  input userShopCartInput {
    uniqueId:String
    productData:[productInfoInput]
    shopPastOrderData:[orderInfoInput]
  }

  input userFarmerEarningInput {
    uniqueId:String
    productData:[productInfoInput]
    farmerPastEarningData:[userEarningInfoInput]
  }


  input orderInfoInput {
    orderId:  String
    shopUniqueId:  String
    paymentId:  String
    totalAmount:  Float
    accoragement:  String
    paymentStatus:  String
    paymentMethod:  String
    shipmentStatus:  String
    shipmentInfo:  String
    quantityGetting:  Float
    productId:  String
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
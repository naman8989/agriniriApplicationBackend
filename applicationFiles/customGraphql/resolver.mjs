import dbInstance from "../database/sqlDatabase.mjs"
import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDefs } from "./schema.mjs";
import { createFarmerDetails } from "../gatherDetails/farmerDetails.mjs";
import { createUser } from "../onboarding/loginSignin.mjs";
import { createShopDetails } from "../gatherDetails/shopDetails.mjs";
import { createFarmerEarningDetails } from "../appData/farmerEarningDetails.mjs";
import { createShopCartDetails } from "../appData/shopCardDetails.mjs";
import { createEarningInfo, createOrderInfo, createProductDetails } from "../appData/appFlowDetails.mjs";

// Resolvers
export const resolvers = {
  Mutation: {

    operateAllUserData: async (_, { operation, input }) => {
      // console.log(operation, input)

      let allResult = []

      for (let element of input) {
        let result = {
          userPrimaryData: null,
          userFarmDetail: null,
          userShopDetail: null,
          userShopCart: null,
          userFarmerEarning: null,
          userProductInfo: null,
          userOrderInfo: null,
          userEarningInfo: null,
        };

        try {

          if (operation == "create") {
            if (element.userPrimaryData) {
              result.userPrimaryData = await createUser(element.userPrimaryData)
            }

            if (element.userFarmDetail) {
              result.userFarmDetail = await createFarmerDetails(element.userFarmDetail)
            }

            if (element.userShopDetail) {
              result.userShopDetail = await createShopDetails(element.userShopDetail)
            }

            if (element.userShopCart) {
              result.userShopCart = await createShopCartDetails(element.userShopCart)
            }

            if (element.userFarmerEarning) {
              result.userFarmerEarning = await createFarmerEarningDetails(element.userFarmerEarning)
            }

            if (element.userProductInfo) {
              result.userProductInfo = await createProductDetails(element.userProductInfo)
            }

            if (element.userOrderInfo) {
              // result.userOrderInfo = await createOrderInfo(element.userOrderInfo)
            }

            if (element.userEarningInfo) {
              // result.userEarningInfo = await createEarningInfo(element.userEarningInfo)
            }

          }else if(operation == "update"){
            
          }


          // Normally you’d insert into DB, here just echo back
          result.status = 200
          result.response = "Might got the data"
        } catch (e) {
          result.status = 400
          result.response = "Some error came up. Try again later!"
        }
        allResult.push(result)
      }

      return allResult
    },


  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });




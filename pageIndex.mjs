import { parse } from "path"
import url from 'url'
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { loginUser, createUser, verifyToken } from "./applicationFiles/onboarding/loginSignin.mjs"
// import { getShopDetails } from "./applicationFiles/gatherDetails/shopDetails.mjs"
// import { storeFarmerDetailsMongo } from "./applicationFiles/gatherDetails/farmerDetails.mjs"
// import { storeShopDetailsMongo } from "./applicationFiles/gatherDetails/shopDetails.mjs"
import { sendEmailOTP, sendWhatsAppOTP } from "./applicationFiles/onboarding/otpService.mjs"

import jwt from "jsonwebtoken"
import { globalAgent } from "http"
import { response } from "express"
import { graphqlHTTP } from "express-graphql"
// import { schema } from "./applicationFiles/customGraphql/schema.mjs"
import { schema } from "./applicationFiles/customGraphql/resolver.mjs"
// import { exeSchema } from "./applicationFiles/customGraphql/resolver.mjs"
import { resolvers } from "./applicationFiles/customGraphql/resolver.mjs"
// const faqPage = require("./applicationFiles/faqDetails/extract_add_Details.cjs")
// const addressInformation = require("./applicationFiles/gatherDetails/addressInformation.cjs")

import { getHomeSchema , saveHomeSchema } from "./applicationFiles/adminBoard/adminFunctions.mjs";
// import { Pages } from './pageIndex.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function tryCatchMiddle(req, res, next) {
    try {
        next(req, res)
    } catch (e) {
        res.end(JSON.stringify({ 'response': 'Some error came up >> ' + e }));
    }
}

function checkPost(req, res, jsonData, next) {
    if (req.method != 'POST') {
        res.statusCode = 404
        res.json({ 'response': 'Use POST method' });

    } else {
        res.end()
    }
    console.log(req.body)
    next(req, res, jsonData)
}

let decode = undefined
export async function Pages(req, res) {
    switch (req.url) {
        case "/":
            if (req.method != 'GET') {
                res.statusCode = 404;
                res.json({ 'response': 'Use GET method', 'status': 'false' });
                break
            }
            res.statusCode = 200
            res.json({ 'response': 'This is agriniri backend server', 'status': 'true' });
            break;

        case "/graphql-data":
            graphqlHTTP({
                schema: schema,
                rootValue: resolvers,
                graphiql: true
            })(req, res)
            break;

        case "/jwt-re-token":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break;
            }
            res.statusCode = 200
            if(req.body.Retoken != "" ){
                let tem = await verifyToken(req.body.Retoken)
                if(tem){
                    res.json({'response':"Token verified!","status":true})
                }else{
                    res.json({'response':"Token not verified!","status":true})
                }
                break
            }
            if (req.body.temId == undefined) {
                res.json({ 'response': "User temperary Id not present" })
                break
            }
            res.json({ 'response': "JWT REFRESH TOKEN", 'token': jwt.sign({ temId: req.body.temId }, global.jwtReToken, { expiresIn: global.jwtReTokenExp }) })
            break
            
        // case "/login":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     // if (req.body.reToken == undefined) {
        //     //     res.statusCode = 401
        //     //     res.json({ 'response': 'Refresh token not found' });
        //     //     break
        //     // }
        //     // try {
        //     //     decode = jwt.verify(req.body.reToken, global.jwtReToken)
        //     // } catch (err) {
        //     //     res.statusCode = 503
        //     //     res.json({ 'response': 'Refresh token expired' });
        //     //     break
        //     // }
        //     // console.log("decode ",decode)
        //     // console.log(req.body)
        //     if (req.body.emailPhone == undefined || req.body.password == undefined) {
        //         res.statusCode = 403
        //         res.json({ 'response': 'Email or Password not found' });
        //         break
        //     }
        //     // console.log(req.body)
        //     loginUser(req, res, req.body.emailPhone, req.body.password);
        //     // res.end("ok")
        //     break;

        // case "/signup":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     // if (req.body.reToken == undefined){
        //     //     res.statusCode = 401
        //     //     res.json({ 'response': 'Refresh token not found' });
        //     //     break
        //     // }
        //     // try{
        //     //     decode = jwt.verify(req.body.reToken,global.jwtReToken)
        //     // }catch(err){
        //     //     res.statusCode = 503
        //     //     res.json({ 'response': 'Refresh token expired' });
        //     //     break
        //     // }
        //     // console.log("decode ",decode)

        //     // console.log(req.body)
        //     if (req.body.name == undefined || req.body.emailPhone == undefined || req.body.password == undefined) {
        //         res.statusCode = 403
        //         res.json({ 'response': 'Name, Email, Phone Number or Password not found' });
        //         break
        //     }
        //     createUser(req, res, req.body.name, req.body.emailPhone, req.body.password);
        //     // res.end({ "response": "in trial", "uniqueId": "q34rqf", "SessionToken": "asdf134rf" })
        //     break;

        case "/otpService":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            // console.log(req.body)
            if (req.body.emailPhone == undefined) {
                res.statusCode = 404;
                res.json({ "response": "Email or Phone Number not found." })
                break
            }
            // console.log("in here")
            // console.log("req.body = ",req.body)
            res.statusCode = 200
            if (req.body.contactType == "email") {
                sendEmailOTP(req,res,req.body.emailPhone)
                // res.json({"response":"otp","otpCode":`${otp}`})
            } else {
                sendWhatsAppOTP(req,res,req.body.emailPhone);
            }
            break;

        case "/adminHomeSchema":
            if(req.method == 'GET'){
                res.status(200)
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.sendFile(path.join(__dirname,"applicationFiles","adminBoard","homeSchemaMaker.html"))
                // res.end()
            }
            if(req.method == 'POST'){
                console.log(req.body)
                console.log(Object.keys(req.body.schema).length)
                if(Object.keys(req.body.schema).length == 0){
                    getHomeSchema(req,res)
                }else{
                    saveHomeSchema(req,res)
                }
            }
            break
        
        case "/addProduct":
            if(req.method == 'GET'){
                res.status(200)
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.sendFile(path.join(__dirname,"applicationFiles","adminBoard","addProduct.html"))
                // res.end()
            }
            break

        case "/createUsers":
            if(req.method == 'GET'){
                res.status(200)
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.sendFile(path.join(__dirname,"applicationFiles","adminBoard","create_user.html"))
                // res.end()
            }
            break
        
        case "/kyc_status":
            if(req.method == 'GET'){
                res.status(200)
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.sendFile(path.join(__dirname,"applicationFiles","adminBoard","kyc_status.html"))
                // res.end()
            }
            break
        
        case "/shopHomePage":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            let retString = JSON.stringify({
                "carouselBanners": [
                {
                    "id": 1,
                    "text": "Get 40% discount\non your first order!",
                    "color": 0xFF81C784, // Colors.green[300]
                    "height": 200.0,
                    "position": 0
                },
                {
                    "id": 1,
                    "text": "Buy 1 Get 1 free",
                    "color": 0xFF81C784, // Colors.green[300]
                    "height": 200.0,
                    "position": 0
                },
                ],
                "banners": [
                {
                    "id": 1,
                    "text": "Get 40% discount\non your first order!",
                    "color": 0xFF81C784, // Colors.green[300]
                    "height": 200.0,
                    "position": 0
                }
                ],
                "iconSlideshow": [
                    {"label": "Veggies", "codePoint": 0xe1aa, "fontFamily": "MaterialIcons"},
                    {"label": "Fruits", "codePoint": 0xf522, "fontFamily": "MaterialIcons"},
                    {"label": "Dairy", "codePoint": 0xe1b1, "fontFamily": "MaterialIcons"}
                ],
                "gridList": {
                "title": "Favourites",
                "count": 4,
                "crossAxisCount": 2,
                "items": [
                    {"page": "ProductDescriptionPage", "type": "popular"},
                    {"page": "ProductDescriptionPage", "type": "popular"},
                    {"page": "ProductDescriptionPage", "type": "popular"},
                    {"page": "ProductDescriptionPage", "type": "popular"}
                ]
                }})
            res.end(retString)
            break
        // case "/occupation":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
            // if (req.body.reToken == undefined){
            //     res.statusCode = 401
            //     res.json({ 'response': 'Refresh token not found' });
            //     break
            // }
            // if (req.body.uniqueId == undefined || req.body.read == undefined || req.body.update == undefined) {
            //     res.statusCode = 401
            //     res.json({ "response": "uniqueId, read, update one of them is missing" })
            //     break
            // }
            // crudOccupation(req, res, req.body.uniqueId, req.body.read, req.body.update)

        case "/shopDetails":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            // console.log(req.body)
            // res.end()
            getShopDetails(req, res, parse.shopData)
            break;

        case "/farmerDetails":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            getFarmerDetails(req, res, req.body.farmerData)
            break;

        case "/farmerDetails/listing":
            if (req.method !== "POST") {
                res.statusCode = 404;
                res.json({ response: "Use POST method" });
                break;
            }

            if(!req.body.loginToken){
                res.statusCode = 404;
                res.json({"response":"Login not found. Please login first"})
            }

            if (!req.body.uniqueId || !req.body.farmerlisting) {
                res.statusCode = 400;
                res.json({ "response": "uniqueId or farmer listing detial is missing" });
                break;
            }

            // Forward everything else to a helper function
            await storeFarmerDetailsMongo(req, res, req.body.farmerlisting);
            break;

        case "/shopDetails/orders":
            if (req.method !== "POST") {
                res.statusCode = 404;
                res.json({ response: "Use POST method" });
                break;
            }

            if (!req.body.uniqueId || !req.body.shopData) {
                res.statusCode = 400;
                res.json({ response: "uniqueId or shopData missing" });
                break;
            }

            // Forward to helper function
            storeShopDetailsMongo(req, res, req.body);
            break;


        // case "/profile/userInfo":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     console.log(req.body)
        //     res.end()
        //     // getUserInfo(req, res, parse.shopData)
        //     break;
        // case "/profile/support":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     console.log(req.body)
        //     res.end()
        //     // getSupportDetails(req, res, parse.shopData)
        //     break;
        // case "/profile/pastOrders":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     console.log(req.body)
        //     res.end()
        //     // getPastOrderDetails(req, res, parse.shopData)
        //     break;
        // case "/profile/addressDetails":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     console.log(req.body)
        //     res.end()
        //     // getUserAddressDetails(req, res, parse.shopData)
        //     break;
        // case "/profile/faq/put":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     faqPage.insertFaqDetails(req, res, req.body)
        //     break;
        // case "/profile/faq/get":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     faqPage.getFaqDetails(req, res, req.body)
        //     break;
        // case "/profile/user-address-information/get":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     addressInformation.getUserAddressInformation(req, res, req.body)
        //     break;
        // case "/profile/user-address-information/put":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     // res.end("ok got it in user address information put")
        //     addressInformation.putUserAddressInformation(req, res, req.body)
        //     break;
        // case "/cart":
        //     if (req.method != 'POST') {
        //         res.statusCode = 404
        //         res.json({ 'response': 'Use POST method' });
        //         break
        //     }
        //     console.log(req.body)
        //     res.end()
        //     // getCartDetails(req, res, parse.shopData)
        //     break;
        // case "/home/itemsList":
        //     checkPost(req, res, parse.itemsList)
        //     break;
        // case "/home/itemDetails":

        //     break;
        // case "/home/popular":
        //     break;
        // case "/search":
        //     break;
        default:
            res.json({"response":"This is default response"});
            res.end();
    }
}



// export = { Pages, tryCatchMiddle }

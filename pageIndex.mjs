import {parse} from "path"
import url from 'url'

import {loginUser, createUser} from "./applicationFiles/onboarding/loginSignin.mjs"
import { getShopDetails } from "./applicationFiles/gatherDetails/shopDetails.mjs"

import jwt  from "jsonwebtoken"
// const faqPage = require("./applicationFiles/faqDetails/extract_add_Details.cjs")

// const addressInformation = require("./applicationFiles/gatherDetails/addressInformation.cjs")

// import { Pages } from './pageIndex.mjs';


export function tryCatchMiddle(req, res, next) {
    try {
        next(req, res)
    } catch (e) {
        res.end(JSON.stringify({ 'response': 'Some error came up >> ' + e }));
    }
}

function checkPost(req,res,jsonData,next){
    if (req.method != 'POST') {
        res.statusCode = 404
        res.json({ 'response': 'Use POST method' });
        
    }else{
        res.end()
    }
    console.log(req.body)
    next(req, res, jsonData)
}

let decode = undefined
export function Pages(req, res) {
    switch (req.url) {
        case "/":
            if (req.method != 'GET') {
                res.statusCode = 404
                res.json({ 'response': 'Use GET method' });
                break
            }
            res.statusCode = 200
            res.json({ 'response': 'This is agriniri backend server' });
            break;

        case "/jwt-re-token":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break;
            }
            res.statusCode == 200
            if (req.body.temId == undefined){
                res.json({'response':"User temperary Id not present"})
                break
            }
            res.json({'response':"JWT REFRESH TOKEN",'token': jwt.sign({temId:req.body.temId},global.jwtReToken,{expiresIn:global.jwtReTokenExp})})
            break

        case "/login":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            if (req.body.reToken == undefined){
                res.statusCode = 401
                res.json({ 'response': 'Refresh token not found' });
                break
            }
            try{
                decode = jwt.verify(req.body.reToken,global.jwtReToken)
            }catch(err){
                res.statusCode = 503
                res.json({ 'response': 'Refresh token expired' });
                break
            }
            // console.log("decode ",decode)
            // console.log(req.body)
            if(req.body.email == undefined || req.body.password == undefined){
                res.statusCode = 403
                res.json({ 'response': 'Email or Password not found' });
                break
            }
            // console.log(req.body)
            loginUser(req, res, req.body.email, req.body.password);
            // res.end("ok")
            break;

        case "/signup":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            if (req.body.reToken == undefined){
                res.statusCode = 401
                res.json({ 'response': 'Refresh token not found' });
                break
            }
            try{
                decode = jwt.verify(req.body.reToken,global.jwtReToken)
            }catch(err){
                res.statusCode = 503
                res.json({ 'response': 'Refresh token expired' });
                break
            }
            // console.log("decode ",decode)
            
            // console.log(req.body)
            if(req.body.email == undefined || req.body.password == undefined){
                res.statusCode = 403
                res.json({ 'response': 'Email or Password not found' });
                break
            }
            createUser(req, res, req.body.name, req.body.email, req.body.password);
            // res.end("ok")
            break;
        
        case "/occupation":
            if(req.method != 'POST'){
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break   
            }
            // if (req.body.reToken == undefined){
            //     res.statusCode = 401
            //     res.json({ 'response': 'Refresh token not found' });
            //     break
            // }
            if(req.body.uniqueId == undefined || req.body.read == undefined || req.body.update == undefined){
                res.statusCode = 401
                res.json({"response":"uniqueId, read, update one of them is missing"})
                break
            }
            crudOccupation(req,res,req.body.uniqueId,req.body.read,req.body.update)

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
            

        case "/profile/userInfo":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // getUserInfo(req, res, parse.shopData)
            break;
        case "/profile/support":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // getSupportDetails(req, res, parse.shopData)
            break;
        case "/profile/pastOrders":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // getPastOrderDetails(req, res, parse.shopData)
            break;
        case "/profile/addressDetails":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // getUserAddressDetails(req, res, parse.shopData)
            break;
        case "/profile/faq/put":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            faqPage.insertFaqDetails(req,res,req.body)
            break;
        case "/profile/faq/get":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            faqPage.getFaqDetails(req,res,req.body)
            break;
        case "/profile/user-address-information/get":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            addressInformation.getUserAddressInformation(req,res,req.body)
            break;
        case "/profile/user-address-information/put":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            // res.end("ok got it in user address information put")
            addressInformation.putUserAddressInformation(req,res,req.body)
            break;
        case "/cart":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // getCartDetails(req, res, parse.shopData)
            break;
        case "/home/itemsList":
            checkPost(req,res,parse.itemsList)
            break;
        case "/home/itemDetails":
            
            break;
        case "/home/popular":
            break;
        case "/search":
            break;
        default:
            res.end("This is default response");
    }
}



// export = { Pages, tryCatchMiddle }

const { parse } = require('path');
const url = require('url');
// const { loginUser, createUser } = require("./applicationFiles/onboarding/loginSignin");
// const { getShopDetails } = require("./applicationFiles/gatherDetails/shopDetails")

const faqPage = require("./applicationFiles/faqDetails/extract_add_Details.cjs")

const addressInformation = require("./applicationFiles/gatherDetails/addressInformation.cjs")

// import { Pages } from './pageIndex.mjs';


function tryCatchMiddle(req, res, next) {
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

function Pages(req, res) {
    parseUrl = url.parse(req.url, true)
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
        case "/login":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log("in here")
            console.log(req.body)
            res.end("ok")
            // loginUser(req, res, parse.email, parse.password);
            break;
        case "/signup":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // createUser(req, res, padrse.name, parse.email, parse.password);
            break;
        case "/shopDetails":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
            // getShopDetails(req, res, parse.shopData)
            break;
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
            res.end();
    }
}



module.exports = { Pages, tryCatchMiddle }

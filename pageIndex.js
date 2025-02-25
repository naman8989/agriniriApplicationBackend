const { parse } = require('path');
const url = require('url');
const { loginUser, createUser } = require("./onboarding/loginSignin");
const { getShopDetails } = require("./gatherDetails/shopDetails")


// import { Pages } from './pageIndex.mjs';


function tryCatchMiddle(req, res, next) {
    try {
        next(req, res)
    } catch (e) {
        res.end(JSON.stringify({ 'response': 'Some error came up >> ' + e }));
    }
}

function Pages(req, res) {
    parseUrl = url.parse(req.url, true)
    switch (req.url) {
        case "/":
            res.statusCode = 200
            res.json({ 'response': 'This is agriniri backend server' });
            break;
        case "/login":
            if (req.method != 'POST') {
                res.statusCode = 404
                res.json({ 'response': 'Use POST method' });
                break
            }
            console.log(req.body)
            res.end()
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
            
            break;
        case "/profile/support":
            break;
        case "/profile/pastOrders":
            break;
        case "/profile/addressDetails":
            break;
        case "/profile/faq":
            break;
        case "/cart":
            break;
        case "/home/itemsList":
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

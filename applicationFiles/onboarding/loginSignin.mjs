
// dataBase = require("../database/sqlDatabase.mjs")
import dbInstance from "../database/sqlDatabase.mjs"

// const bcrypt = require("bcryptjs");
import bcrypt, { compareSync } from "bcryptjs";
import jwt  from "jsonwebtoken"
// const crypto = require("crypto");
import crypto from "crypto";
// const { userInfo } = require("os");
import os from "os"

let userData = new dbInstance("users")
// const saltRound = 15;
// function hashPassword(password) {
//     bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//     if (err) {
//       console.error("Error hashing password:", err);
//       return ;
//     }
//       console.log("Hashed password:", hashedPassword);
//       return hashedPassword
//     });
// }

// function verifyPassword(inputPassword, storedHash) {
//   bcrypt.compare(inputPassword, storedHash, (err, isMatch) => {
//     if (err) {
//       console.error('Error comparing passwords:', err);
//       return [err, null];
//     }
//     // Return whether the password matches the hashed password in the database
//     return [null, isMatch];
//   });
// }

function generateBase64Id(email, password) {
  // Combine the username and password into a string (you can add a separator if needed)
  const combined = password + ':' + email; // Example: "username:password"

  // Convert the combined string to Base64
  const base64Id = Buffer.from(combined).toString('base64');

  return base64Id;
}

export async function createUser(jsonData) {
  try {
    // basic validation
    if (!jsonData.emailPhone || !jsonData.hashPassword || !jsonData.name) {
      return [{ status: 400, response: "Email, Password or Name not present" }]
    }

    // hash password
    const hash = await bcrypt.hash(jsonData.hashPassword, global.passwordSaltRound);

    // uniqueId generation
    const uniqueId = generateBase64Id(jsonData.emailPhone, hash);

    if (!hash || !uniqueId) {
      return [{status: 400 , response: "Error while creating user. Try again later!" }]
    }

    // check if user exists
    const foundUser = await userData.findInColumn("emailPhone", jsonData.emailPhone);

    if (foundUser[1].length > 0) {
      return [{status: 409 , response : "Account already exists. Signup with another account!"}]
    }

    // create JWT
    const reToken = await new Promise((resolve, reject) => {
      jwt.sign(
        { name: jsonData.name, email: jsonData.emailPhone },
        global.jwtSeToken,
        { expiresIn: global.jwtSeTokenExp },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });

    // insert data into DB
    const data = await userData.insertData(
      ["name", "emailPhone", "hashedPassword", "uniqueId", "occupation", "reToken", "kycStatus"],
      [
        jsonData.name,
        jsonData.emailPhone,
        hash,
        uniqueId,
        jsonData.occupation,
        reToken,
        jsonData.kycStatus || 0,
      ]
    );

    // prepare result
    return[{
      status : 200,
      response : "Data Stored Successfully",
      
      name : jsonData.name,
      emailPhone : jsonData.emailPhone,
      uniqueId : uniqueId,
      retoken : reToken,
      occupation : jsonData.occupation,
      kycStatus : jsonData.kycStatus 
    }]
  
  } catch (err) {
    console.error("Error in createUser:", err);
    return [{status : 500, response : "Internal Server Error" }]
  }
}


export async function loginUser(req, res, email, password) {
  // check the req data 
  if (req == undefined || email == undefined || password == undefined) {
    res.json({ 'response': `Email or Password not present` })
    console.log((req != undefined), (email != undefined), (password != undefined))
    return
  }
  // check for email in database 
  let ret = await userData.findInColumn("email", email)
  // console.log("ret = ",ret[1].length)
  if(ret[1].length == 0){
    res.json({"response":"Account not found. Sigin up using this "+email})
    return
  }
  bcrypt.compare(password, ret[1][0]["hashedPassword"], (err, result) => {
    if (err) {
      // Handle error
      res.json({ "response": "Error while checking your password. Try again later or Change your password by clicking on Forget Password" })
    } else if (result) {
      // Store the hash in your database
      ret[1][0]["hashedPassword"] = true
      ret[1][0]["SessionToken"] = jwt.sign(ret[1][0],global.jwtSeToken,{expiresIn:global.jwtSeTokenExp})
      ret[1][0]["response"] = "You are Loged."
      // ret[1][0]["uniqueId"] = 
    } else {
      ret[1][0]["hashedPassword"] = false
      ret[1][0]["response"] = "Entered Wrong Password ! "
    }
    console.log(ret[1][0])
    res.json(ret[1][0])
  });
}

export async function crudOccupation(req,res,uniqueId,read,update){
  if (req == undefined || read == undefined || update == undefined || uniqueId == undefined) {
    res.json({ 'response': `read or update instruction not present` })
    console.log((req != undefined), (read != undefined), (update != undefined))
    return
  }
  let ret = await userData.findInColumn("uniqueId",uniqueId)
  if(ret[1].length == 0){
    res.json({"response":"Account not found. Using uniqueId"})
    return
  }
  if (read == true){
    res.json({"response":"Occupation is fetch"},ret[1])
  }
  if(read==false){
    let ret1 = await userData.updateUsers(["uniqueId", uniqueId], ["occupation", update])
    res.json({"response":"Occupation updated"})
  }
  return 
}

export async function verifyToken(reToken){
  try {
    let decode = jwt.verify(reToken, global.jwtReToken)
  } catch (err) {
    // console.log("decode ",decode)
    // res.statusCode = 503
    // res.json({ 'response': 'Refresh token expired' });
    return false
  }
  // console.log("decode ",decode)
  return true
}

// module.exports = {loginUser,createUser}
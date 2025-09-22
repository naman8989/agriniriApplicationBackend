
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

export function createUser(req, res, name, email, password) {
  if (req == undefined || email == undefined || password == undefined || name == undefined) {
    res.json({ 'response': `Email, Password or name not present` })
    // console.log((req  != undefined ), (email  != undefined ),( password  != undefined))
    return
  }

  bcrypt.hash(password, global.passwordSaltRound, (err, hash) => {
    if (err) {
      res.json({ "response": "Error while making hash password" })
      return
    } else {
      // Store the hash in your database
      let uniqueId = generateBase64Id(email, password)
      if (hash != null || uniqueId != null) {
        // check for if user is present or not
        userData.findInColumn("email", email).then(foundUser => {

          if (foundUser[1].length != 0){
            res.json({ 'response': `Email already present`, "uniqueId": `null` })
          }else{
            // create new user id and password
            // send it to database
            userData.insertData(["name", "email", "hashedPassword", "uniqueId"], [name, email, hash, uniqueId])
            res.statusCode = 200
            res.json({ 'response': `Got the uniqueId`, "uniqueId": `${uniqueId}`, "SessionToken": jwt.sign({name:req.body.name,email:req.body.email} ,global.jwtSeToken,{expiresIn:global.jwtSeTokenExp}) })
          }
        })
       
      } else {
        res.statusCode = 404
        res.json({ 'response': `Error while creating user`, "uniqueId": `null` })
        return
      }

    }
  })

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
    } else {
      ret[1][0]["hashedPassword"] = false
    }
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

// module.exports = {loginUser,createUser}
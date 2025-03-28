
dataBase = require("../database/sqlDatabase")
const bcrypt = require("bcrypt")
const crypto = require("crypto");
const { userInfo } = require("os");

userData = new dataBase("users")
const saltRound = 15;
function hashPassword(password) {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return ;
    }
      console.log("Hashed password:", hashedPassword);
      return hashedPassword
    });
}

function verifyPassword(inputPassword, storedHash) {
    bcrypt.compare(inputPassword, storedHash, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return [err,null];
      }
      // Return whether the password matches the hashed password in the database
      return [null, isMatch];
    });
}

function generateBase64Id(email, password) {
    // Combine the username and password into a string (you can add a separator if needed)
    const combined = password + ':' + email; // Example: "username:password"

    // Convert the combined string to Base64
    const base64Id = Buffer.from(combined).toString('base64');

    return base64Id;
}

function createUser(req,res,name,email,password){
    hpass = hashPassword(password)
    uniqueId = generateBase64Id(email,password)
    if(hpass != null  || uniqueId != null){
        // check for if user is present or not
        ret = userData.findInColumn("users","email",email)
        if(re[1]!=null){
            res.json({ 'response': `Email already present`,"userId":`null` })
            return
        }

        // create new user id and password
        // send it to database
        userData.insertUser("users",["name","email","hashedPassword","userId"],[name, email, hpass, uniqueId])
        res.statusCode= 200
        res.json({ 'response': `Got the userId`,"userId":`${uniqueId}` })
        // return user id 
    }   
    res.statusCode = 404
    res.json({ 'response': `Error while creating user`,"userId":`null` })
    
}

function loginUser (req,res,email,password){
    // check for email in database 
    ret = userData.findInColumn("users","email",email)
    if(ret[0]==null){
        if(verifyPassword(password,ret[1][2])[0]==null){
            res.json({ 'response': `User verified`,"userId":`${ret[1][3]}` })
        }else{
            res.json({ 'response': `User not verified`,"userId":`null` })
        }
    }
    // return user id 
}

module.exports = {loginUser,createUser}
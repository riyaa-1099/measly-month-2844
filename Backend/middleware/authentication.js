const jwt=require("jsonwebtoken")
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.redishost,
  port: process.env.redisport,
  password: process.env.redispassword,
  username: process.env.redisusername
});
require('dotenv').config();

const authentication=async(req,res,next)=>{
    
const token=req.headers.authorization?.split(" ")[1] ;
//console.log(token)
if (!token) {
    return res.status(401).send('You are not authorized.');
}

const isBlacklisted = await redis.sismember('blacklisted', token);
if (isBlacklisted) {
    return res.status(401).send('You have been blacklisted. Please login again.');
}

try{
    const decoded=jwt.verify(token,process.env.secretKey);
    // console.log(decoded)
if(decoded){

const userID=decoded.userID;
req.body.userID=userID;
next()

}
}
catch(err){
    console.log(err)
    res.send({"msg":"incorrect token",status:err.message})
}

}

module.exports=authentication;
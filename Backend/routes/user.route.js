const express=require("express")
const userRouter=express.Router();
const Redis = require('ioredis');
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const authentication=require("../middleware/authentication")
require("dotenv").config();

const redis = new Redis({
  host: process.env.redishost,
  port: process.env.redisport,
  password: process.env.redispassword,
  username: process.env.redisusername
});


const {Usermodel}=require("../models/user.model")

userRouter.post("/signup",async (req,res)=>{
const {email,password,name}=req.body;
if(!name||!email||!password){
    res.send({msg:"Complete your details",status:"fail"});
    return;
}
const user=await Usermodel.find({email})
if(user.length>=1){
    res.send({"msg":"Sorry, user already exist",status:"fail"});  
}
else{
try{
bcrypt.hash(password,4,async function(err,hash){
    if (err) {
        console.log(err);
        res.send({ msg: "error while signing in",status: "error",
        });
      }
       else {

const current=new Usermodel({email,password:hash,name})
const saved=await current.save();
// let {token,refreshToken}=tokencreate(res,saved._id,saved.role)

res.send({"msg":"Sign-up Successfull"})
      }
  })
}
catch(err){
console.log(err)
res.send({"msg":"Something went wrong"})
     }
  }
});


userRouter.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    if(!email ||!password){
        res.send({ msg: "fill all the fields", status: "fail" });
        return;
    }
    try{
    const user=await Usermodel.find({email})
    if(user.length>0){
       const hashed_pass=user[0].password;
       bcrypt.compare(password,hashed_pass,function(err,result){
        if(result){
        let {token,refreshToken}=tokencreate(res,user[0]._id,user[0].role)  
        
        res.send({"msg":"Login Successfull","token":token,"refreshToken":refreshToken})
        }
        else{
            res.send({"msg":"wrong password"})
        }
      })
    }
    else{   
    res.send({"msg":"User not found"}) 
    }
}
    catch(err){
    console.log(err)
    console.log({"msg":"Something went wrong"})
    }
    })

    //logout------------------------------------------------------------------>
    userRouter.get('/logout',authentication, async (req, res) => {
      // Log out the user
      const token=req.headers?.authorization?.split(" ")[1];
      await redis.sadd('blacklisted', token);
      res.send({"msg":"logged out successfully"});
    });

    //checking blacklist--------------------------------------------------------->
    userRouter.post('/blacklist',authentication, async(req, res) => {
      const { token } = req.body;
    
     await redis.sismember('blacklist', token, (err, reply) => {
        if (err) {
          return res.status(500).json({ message: 'Error checking token in blacklist' });
        }
        if(reply === 1)
        res.status(200).send({ "isBlacklisted": "true" });
      else
        res.status(200).send({ "isBlacklisted": "false" });
       
      });
    });

function tokencreate(res,userId,role){

  let token = jwt.sign({ userId, role }, process.env.secretKey, {
    expiresIn: "1d",
  });
  let refreshToken = jwt.sign({ userId, role }, process.env.refreshKey, {
    expiresIn: "10d",
  });

  return { token, refreshToken };

    }

    module.exports={
        userRouter
    }

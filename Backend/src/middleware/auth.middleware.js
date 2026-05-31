const blacklistModel = require("../models/blackList.model");
const userModel=require("../models/user.model")
const redis = require("../config/cache")
const jwt=require("jsonwebtoken")

async function authUser(req,res ,next){
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Token not Provided"
        })
    }
//Token Blaclisting--> check token id blacklisting
    const isTokenBlacklisted= await redis.get(token)
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }

    //Token check krne ke liye method
    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRATE )

    //req me user nam ki property exist nhi krti thi , per yha pr main create ke rha hu

    req.user=decoded;
    next();//aage forword krne ke liye

    }
    catch(err){
        return res.status(401).json({
            message:"Token invalid"
        })
    }

}


module.exports=
{
    authUser
}
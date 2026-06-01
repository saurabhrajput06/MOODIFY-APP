const userModel=require("../models/user.model")
const bycrpt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const blacklistModel=require("../models/blackList.model")
const redis=require("../config/cache")

//user register krne k liye
async function registerUser(req, res){
const {username ,email , password}=req.body;

//check user is existes?
const isAlreadyRegister =await userModel.findOne({
 $or:[
    { email},
    {username}
 ]
})


if(isAlreadyRegister){
    return res.status(400).json({
    message:"user with the same name and same email is already exits"    
    })
}

//password ko hash krna  
 const hash= await bycrpt.hash(password,10);

//Creating the user
 const user= await userModel.create({
    username, email , password:hash
 })

 const token=jwt.sign({
    id:user._id,
    user:user.username

 } ,process.env.JWT_SECRATE,
{
    expiresIn:"3d"
}
)
res.cookie("token" , token)

res.status(200).json({
    message:"user registerd succesfullly",
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        password:user.password
    }

})

}

//user ko log in krne ke liye 
async function loginUser(req,res){
    const{email , password , username}=req.body

    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ],
    })
    //password ko bejne ke liye
    .select("+password")

    if(!user){
       return res.status(400).json({
            message:"Invalid credentials"
        })
    }
// cheaking password is valid or not
    const isPasswordValid=await bycrpt.compare(password , user.password);

     if(!isPasswordValid){
       return res.status(400).json({
            message:"Invalid credentials"
        })
    }

    const token= jwt.sign({ id:user._id, username:user.username}, process.env.JWT_SECRATE,
{
    expiresIn:"3d"
}
)
// res.cookie("token",token),

// 👈 Ye line important hai cross-origin cookies ke liye
res.cookie("token", token, {
        httpOnly: true,
        secure: true,      
        sameSite: "none",  
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 din tak cookie ko expire nahi hone dega
    })

return res.status(200).json({
    message:"User Login Successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})


}

//user ki information nikalne ke liye
async function getMe(req,res){
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message:"user fetched successfully",
        user
    })
}

//logOut krne ke liye
async function logoutUser(req,res){
    const token = req.cookies.token

    res.clearCookie("token")

     await redis.set(token , Date.now().toString() ,"EX" , 60*60)
    res.status(200).json({
        message:"logout user successfully"
    })
}


module.exports={
    registerUser,
    loginUser,
    getMe,
    logoutUser

}
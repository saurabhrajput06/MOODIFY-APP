const mongoose=require("mongoose")


const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true, "user name is required"],
        unique:[true, "username must be unique"]
    },
     email:{
        type:String,
        required:[true, "email is required"],
        unique:[true, "email must be unique"]
    },
    password:{
        type:String,
        required: [true , "possword is required"],
        select:false  //kisi user ke data ko get krne mw user ka password read hone se bachane k liye

    }

})

const userModel=mongoose.model("users", userSchema);

module.exports=userModel
const authController=require("../Controllers/auth.controller")
const authMiddleware=require("../middleware/auth.middleware")
//require express
const express=require("express")

//router ko express se connected krne ke liye

const router=express.Router();

//define APIs here\

router.post("/register",authController.registerUser)
router.post("/login",authController.loginUser)


router.get("/get-me",authMiddleware.authUser , authController.getMe)

router.get("/logout" , authController.logoutUser)



module.exports=router;
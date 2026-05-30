import { AuthContext } from "../../../auth.context";
import { login , register , getMe , logout } from "../../services/auth.api";
import {useContext, useEffect} from "react"



export const useAuth=()=>{
    const context = useContext(AuthContext)
    const {user , setuser ,loading , setloading}=context

   
//register
 async function handleRegister({username , email , password}){
   setloading(true)
   try {
     const data=await register({username , email , password})
     setuser(data.user)
     return data
   } catch (err) {
     setuser(null)
     throw err
   } finally {
     setloading(false)
   }
 }

//login
async function handleLogin({username , email , password}){
   setloading(true)
   try {
     const data=await login({username , email , password})
     setuser(data.user)
     return data
   } catch (err) {
     setuser(null)
     throw err
   } finally {
     setloading(false)
   }
 }

 //get me 
 async function handleGetMe(){
   setloading(true)
   try {
     const data=await getMe()
     setuser(data.user)
   } catch (err) {
     setuser(null)
     console.warn("User is not authenticated (silent check).")
   } finally {
     setloading(false)
   }
 }

 //logout
 async function handlelogout(){
   setloading(true)
   try {
     const data=await logout()
     console.log(data)
   } catch (err) {
     console.error("Logout error:", err)
   } finally {
     setuser(null)
     setloading(false)
   }
 }

 useEffect(() => {
    
    handleGetMe()
 },[] );

 return ({
    user , loading , handleRegister,handleLogin , handlelogout,handleGetMe
 })

}

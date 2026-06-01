import { Navigate  } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import React from 'react'

import Loader from "../../shared/components/Loader";

const Protected = ({children}) => {
const {user ,loading}=useAuth()
const navigate = useNavigate()
    





if(loading){
    return <Loader />
   } 
   
if (!user) {
        return <Navigate to="/login" replace />; // 'replace' history clean rakhta hai
    }
    

  return children

  
}

export default Protected
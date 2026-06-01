import {createContext , useState, useEffect} from "react"
import { getMe } from "./features/auth/services/auth.api"

export const AuthContext =createContext()

export const AuthProvider=({children})=>{
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getMe()
                setuser(data.user)
            } catch (err) {
                setuser(null)
                console.warn("User is not authenticated (silent check).")
            } finally {
                setloading(false)
            }
        }
        checkAuth()
    }, [])

return (
    <AuthContext.Provider value={{user , setuser , loading , setloading}}>
        {children}

    </AuthContext.Provider>
)

}
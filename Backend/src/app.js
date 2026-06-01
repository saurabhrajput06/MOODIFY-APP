const  express = require("express")
const cookieParser  = require("cookie-parser")
const cors=require("cors")



const app = express()
app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin:["http://localhost:5173","https://moodify-app-1.onrender.com"],
    credentials:true
}))

//routes

const authRoutes=require("./Routes/auth.route")
const songsRoutes=require("./Routes/song.rotes")
app.use("/api/auth",authRoutes)
app.use("/api/songs",songsRoutes)

module.exports=app
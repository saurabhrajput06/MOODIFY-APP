require('dotenv').config() // Ye line sabse top par honi chahiye
const app = require("./src/app")
const connectToDb = require("./src/config/database")
connectToDb()
app.listen(3000, () => {
    console.log("server is running on port 3000");
})
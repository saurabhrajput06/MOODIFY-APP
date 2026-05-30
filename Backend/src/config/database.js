// const mongoose=require("mongoose")

const mongoose = require("mongoose");

async function connectToDb(){
await mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((err)=>{
    console.log("MongoDB Error:", err);
});
}
 
// function connectToDb(){
   
//     mongoose.connect('mongodb+srv://saurabhrajputcs9528_db_user:EsD3hYuH8zPYThL8@cluster0.yvg0drl.mongodb.net/Moodify', {
//   family: 4 // Ye line Node ko force karegi IPv4 use karne ke liye
// })
// .then(() => console.log("DB Connected!"))
// .catch(err => console.log("Error details:", err));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ Database Connected!"))
//   .catch((err) => {
//     console.log("❌ Connection Error Detail:");
//     console.log(err);
//   });


//   async function connectToDb() {
//   try {

//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 5000,   // 5 sec me server find karega
//       socketTimeoutMS: 45000,           // socket timeout
//     });

//     console.log("✅ Database Connected");

//   } catch (err) {
//     console.log("❌ MongoDB Error:", err);
//   }
// }

// mongoose.connection.on("connected", () => {
//   console.log("MongoDB connected");
// });

// mongoose.connection.on("error", (err) => {
//   console.log("MongoDB connection error:", err);
// });

// mongoose.connection.on("disconnected", () => {
//   console.log("MongoDB disconnected");
// });
    // mongoose.connect(process.env.MONGO_URI) 
    // .then(()=>{
    //     console.log("connect to Db");
        
    // })
    // .catch(err=>{
    // console.log("error connecting to db",err);
        
    // })


module.exports=connectToDb;
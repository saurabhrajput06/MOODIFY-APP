const multer=require("multer")

const storage= multer.memoryStorage()

const upload=multer({
 storage:storage,
 limits:{
    fileSize:1024*1024*15// 15MB
 },
 fileFilter:(req,file,cb)=>{
    if(file.mimetype.startsWith("audio/")){
        cb(null,true)
    }else{
        cb(new Error("Invalid file type"),false)
    }
 }  
})

module.exports=upload
const express = require("express")
const upload=require("../middleware/upload.middleware")
const songController = require("../Controllers/song.controller")

const router  = express.Router()


router.post("/", upload.single("song"),songController.uploadSong)
module.exports=router
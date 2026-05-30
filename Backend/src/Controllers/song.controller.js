const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")

async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)
    console.log(tags);

    const songTitle = tags.title || `song_${Date.now()}`;
    const hasImage = !!(tags.image && tags.image.imageBuffer);

    const uploadPromises = [
        storageService.uploadFile({
            buffer: songBuffer,
            filename: `${songTitle}.mp3`,
            folder: "/cohort-2/moodify/songs"
        })
    ];

    if (hasImage) {
        uploadPromises.push(
            storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: `${songTitle}.jpeg`,
                folder: "/cohort-2/moodify/posters"
            })
        );
    }

    const uploadResults = await Promise.all(uploadPromises);
    const songFile = uploadResults[0];
    const posterFile = hasImage ? uploadResults[1] : null;

    const song = await songModel.create({
        title: songTitle,
        url: songFile.url,
        posterUrl: posterFile ? posterFile.url : "",
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })

}

async function getSong(req, res) {

    const { mood } = req.query

    const song = await songModel.findOne({
        mood,
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })

}




module.exports = { uploadSong, getSong }
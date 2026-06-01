import axios from "axios"

const api = axios.create({
    baseURL: "https://moodify-app-vrs3.onrender.com",
    withCredentials: true
})

export async function fetchSongByMood(mood) {
    const response = await api.get("/api/songs", {
        params: { mood }
    })
    return response.data // { message, song: { title, url, posterUrl, mood } }
}

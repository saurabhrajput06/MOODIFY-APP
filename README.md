# 🎧 Moodify-App

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Cache-Redis-red.svg)](https://redis.io)
[![ImageKit](https://img.shields.io/badge/Storage-ImageKit-orange.svg)](https://imagekit.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Moodify-App is a sophisticated, vibe-centric music management and streaming platform designed to map user moods to dynamically curated audio tracks. Built with a high-performance backend architecture, it automates heavy multimedia asset pipelines and optimizes real-time responsiveness using enterprise-grade cloud integrations.

---

## 🚀 Key Features

- **Mood-Based Curation:** Dynamically groups and streams audio tracks based on user vibes/moods.
- **Robust Multimedia Pipeline:** Uses `Multer` for memory storage buffering and `ImageKit.io SDK` for parallel uploading of `.mp3` audio files and cover art image assets.
- **High-Speed Caching:** Integrated `Redis (ioredis)` caching layer over `MongoDB` to minimize latency and optimize query response times for frequently accessed data.
- **Modern UI Architecture:** Component-driven frontend developed using React and styled with modular, maintainable Sass configurations.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Sass (Dart Sass architecture), Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Caching Layer:** Redis Cloud (`ioredis`)
- **Cloud Storage:** ImageKit.io SDK

---

## 📁 Project Structure

```text
MOODIFY-APP/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & Cloud initializations
│   │   ├── Controllers/     # Request handlers (song.controller.js, etc.)
│   │   ├── Middleware/      # Auth & Multer multi-part parsers
│   │   ├── models/          # Mongoose Schemas (Song, User)
│   │   ├── Routes/          # Express API Endpoints
│   │   └── services/        # Storage and third-party logic (storage.service.js)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── Frontend/                # React application client
⚙️ Getting StartedPrerequisitesMake sure you have Node.js, npm, and a local or cloud instance of Redis and MongoDB running.1. Clone the RepositoryBashgit clone [https://github.com/saurabhrajput06/MOODIFY-APP.git](https://github.com/saurabhrajput06/MOODIFY-APP.git)
cd MOODIFY-APP


2. Backend SetupNavigate to the backend directory, install dependencies, and configure environment variables.Bashcd Backend
npm install
Create a .env file in the Backend directory and populate it using the template below:Code snippetPORT=3000
MONGODB_URI=your_mongodb_connection_string

REDIS_HOST=your_redis_cloud_endpoint
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint_without_trailing_slash
Start the backend development server:Bashnpm run dev


3. Frontend SetupOpen a new terminal window, navigate to the frontend directory, install dependencies, and start the client.Bashcd Frontend
npm install
npm run dev
🧪 API Endpoints (Quick Reference)Songs ManagementMethodEndpointDescriptionAuth RequiredPOST/api/songs/Upload a new song (audio + thumbnail fields)YesGET/api/songsFetch all songs filtered by mood/vibeNo

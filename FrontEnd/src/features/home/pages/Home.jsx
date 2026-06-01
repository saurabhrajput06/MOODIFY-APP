import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { init, detect } from "../../Expression/utils/Utils"
import "./Home.scss"
import { fetchSongByMood } from "../Service/song.api"



function Home() {
  const { user, handlelogout } = useAuth()

  // Webcam & Landmarker refs
  const videoRef = useRef(null)
  const landmarkerRef = useRef(null)
  const streamRef = useRef(null)
  const audioRef = useRef(null)

  // Scanning & Expression State
  const [expression, setExpression] = useState("Neutral")
  const [isScanning, setIsScanning] = useState(false)
  const [isAutoScanning, setIsAutoScanning] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  // Playlist & Music Player State
  const [playlist, setPlaylist] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isLoadingSong, setIsLoadingSong] = useState(false)

  // Derive current song from playlist
  const activeSong = playlist[currentTrackIndex] || null

  // Mapping expression strings to backend mood enum
  const mapExpressionToMood = (expr) => {
    if (!expr) return "neutral"
    const lower = expr.toLowerCase()
    if (lower.includes("happy")) return "happy"
    if (lower.includes("sad")) return "sad"
    if (lower.includes("surprised")) return "surprised"
    return "neutral"
  }

  // Set up webcam & MediaPipe Face Landmarker
  const startCamera = async () => {
    try {
      await init({ landmarkerRef, videoRef, streamRef })
      setCameraActive(true)
    } catch (err) {
      console.error("Webcam / MediaPipe Init Error:", err)
      setCameraActive(false)
    }
  }

  useEffect(() => {
    startCamera()

    // Default load neutral playlist
    loadPlaylist("neutral")

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Sync volume state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Sync playing state with audio element on song index / playlist change
  useEffect(() => {
    if (!audioRef.current || !activeSong) return
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Playback prevented or interrupted:", err)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrackIndex, playlist, activeSong])

  // Periodic Auto-Scanner Hook
  useEffect(() => {
    let intervalId = null
    if (isAutoScanning && cameraActive) {
      intervalId = setInterval(() => {
        performExpressionScan(true)
      }, 4000)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAutoScanning, cameraActive])

  // Helper to fetch songs matching mood from API
  const loadPlaylist = async (mood) => {
    setIsLoadingSong(true)
    try {
      const queryMood = mood
      const data = await fetchSongByMood(queryMood)

      if (data && data.songs && data.songs.length > 0) {
        setPlaylist(data.songs)
        setCurrentTrackIndex(0)
      } else {
        setPlaylist([])
        setCurrentTrackIndex(0)
      }
    } catch (err) {
      console.warn("Failed to fetch songs from DB:", err)
      setPlaylist([])
      setCurrentTrackIndex(0)
    } finally {
      setIsLoadingSong(false)
    }
  }

  // Triggers MediaPipe expression recognition
  const performExpressionScan = (isSilent = false) => {
    if (!landmarkerRef.current || !videoRef.current) return

    if (!isSilent) {
      setIsScanning(true)
    }

    setTimeout(() => {
      detect({
        landmarkerRef,
        videoRef,
        setExpression: (detectedVal) => {
          setExpression(detectedVal)
          const newMood = mapExpressionToMood(detectedVal)
          loadPlaylist(newMood)

          if (!isSilent) {
            setIsScanning(false)
            // Trigger automatic playback on manual scan
            setIsPlaying(true)
          }
        }
      })
    }, isSilent ? 0 : 1200)
  }

  // Formatting times for custom audio bar
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00"
    const mins = Math.floor(timeInSeconds / 60)
    const secs = Math.floor(timeInSeconds % 60)
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Audio Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Automatic autoplay next track in queue
  const handleAudioEnded = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1)
      setIsPlaying(true)
    } else {
      // Loop back to start or pause
      setCurrentTrackIndex(0)
      setIsPlaying(false)
    }
  }

  const handleNextTrack = () => {
    if (playlist.length > 1) {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
      setIsPlaying(true)
    }
  }

  const handlePrevTrack = () => {
    if (playlist.length > 1) {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length)
      setIsPlaying(true)
    }
  }

  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const clickPercentage = clickX / width
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = clickPercentage * duration
      setCurrentTime(clickPercentage * duration)
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name.slice(0, 2).toUpperCase()
  }

  const currentMoodMapped = mapExpressionToMood(expression)

  return (
    <div className="home-dashboard">
      {/* Ambient background glows */}
      <div className="bg-glow-circle circle-purple"></div>
      <div className="bg-glow-circle circle-pink"></div>
      <div className="bg-glow-circle circle-cyan"></div>

      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="brand">
          <div className="logo-icon">M</div>
          <h1>Mood<span>ify</span></h1>
        </div>

        <div className="user-profile">
          <div className="avatar">
            {getInitials(user?.username)}
          </div>
          <span className="username" title={user?.username}>
            {user?.username || "Guest"}
          </span>
          <button className="logout-btn" onClick={handlelogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="dashboard-grid">
        {/* Left Side: webcam Vibe scanner */}
        <section className="dashboard-card scanner-card">
          <h2 className="card-title">
            Vibe <span className="accent">Scanner</span>
          </h2>

          <div className="scanner-wrapper">
            <video
              ref={videoRef}
              style={{ display: cameraActive ? "block" : "none" }}
              playsInline
              muted
            />
            {isScanning && <div className="scanner-line"></div>}
            <div className="viewfinder-corner top-left"></div>
            <div className="viewfinder-corner top-right"></div>
            <div className="viewfinder-corner bottom-left"></div>
            <div className="viewfinder-corner bottom-right"></div>

            {/* Cyber scanner crosshair target */}
            {cameraActive && (
              <div className="scanner-target">
                <div className="target-ring"></div>
                <div className="target-line-h"></div>
                <div className="target-line-v"></div>
              </div>
            )}

            {!cameraActive && (
              <div className="scanner-placeholder" style={{ position: "absolute", zIndex: 10 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p>Initializing Webcam scanner...</p>
              </div>
            )}
          </div>

          <div className="scanner-controls">
            <div className={`mood-display-box ${expression !== "Detecting..." ? "active" : ""}`}>
              <span className="mood-label">Current Emotion:</span>
              <span className="mood-value">{expression}</span>
            </div>

            <div className="btn-group">
              <button
                className={`action-btn ${isScanning ? "scanning" : ""}`}
                onClick={() => performExpressionScan(false)}
                disabled={isScanning || !cameraActive}
              >
                {isScanning ? (
                  "Scanning Vibe..."
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Scan Vibe
                  </>
                )}
              </button>

              <button
                className={`toggle-auto-btn ${isAutoScanning ? "active" : ""}`}
                onClick={() => setIsAutoScanning(!isAutoScanning)}
                disabled={!cameraActive}
              >
                {isAutoScanning ? "Auto: ON" : "Auto: OFF"}
              </button>
            </div>
          </div>
        </section>

        {/* Right Side: Sound Wave Player Card */}
        <section className="dashboard-card player-card">
          <h2 className="card-title">
            Vibe <span className="accent">Beats</span>
          </h2>

          <div className="player-container">
            {/* Interactive Album Sleeve & Sliding Vinyl */}
            <div className="album-vinyl-container">
              <div className={`album-cover-wrapper ${currentMoodMapped} ${isLoadingSong ? "loading" : ""}`}>
                {isLoadingSong ? (
                  <div className="album-cover-loading-shimmer">
                    <div className="shimmer-logo">M</div>
                    <div className="shimmer-pulse"></div>
                  </div>
                ) : activeSong?.posterUrl ? (
                  <img className="album-cover-img" src={activeSong.posterUrl} alt="Album Art" />
                ) : (
                  <div className={`album-cover-placeholder ${currentMoodMapped}`}>
                    <div className="placeholder-logo">M</div>
                    <span className="mood-emoji">
                      {playlist.length === 0 ? "🔇" : (
                        currentMoodMapped === "happy" ? "😄" :
                          currentMoodMapped === "sad" ? "😢" :
                            currentMoodMapped === "surprised" ? "😲" : "😐"
                      )}
                    </span>
                    <div className="mood-name">
                      {playlist.length === 0 ? "No Tracks found" : `${currentMoodMapped} vibe`}
                    </div>
                  </div>
                )}
              </div>

              {playlist.length > 0 && !isLoadingSong && (
                <div className={`vinyl-disc ${isPlaying ? "playing" : ""}`}>
                  <div className="vinyl-grooves"></div>
                  <div className={`vinyl-center-label ${currentMoodMapped}`}>
                    {activeSong?.posterUrl ? (
                      <img src={activeSong.posterUrl} alt="Center Label" />
                    ) : (
                      <span className="mini-emoji">
                        {currentMoodMapped === "happy" ? "😄" :
                          currentMoodMapped === "sad" ? "😢" :
                            currentMoodMapped === "surprised" ? "😲" : "😐"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Element (Hidden) */}
            <audio
              ref={audioRef}
              src={activeSong?.url || ""}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleAudioEnded}
            />

            {/* Track Info */}
            <div className="track-details">
              {isLoadingSong ? (
                <>
                  <div className="skeleton-text-line skeleton-title"></div>
                  <div className="skeleton-text-line skeleton-artist"></div>
                  <div className="skeleton-badge-pill"></div>
                </>
              ) : (
                <>
                  <div className="track-title" title={activeSong?.title || "Queue is Empty"}>
                    {activeSong?.title || "No Track Loaded"}
                  </div>
                  <div className="track-artist">
                    {playlist.length === 0 ? "Upload songs in backend" : "Moodify Database"}
                  </div>
                  <span className={`track-mood-badge ${currentMoodMapped}`}>
                    Vibe: {currentMoodMapped}
                  </span>
                </>
              )}
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
              <span className="time-display">{formatTime(currentTime)}</span>
              <div className="progress-track" onClick={handleProgressChange}>
                <div
                  className={`progress-fill ${currentMoodMapped}`}
                  style={{ width: `${duration > 0 && activeSong ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="time-display">{formatTime(duration)}</span>
            </div>

            {/* Audio Action Buttons */}
            <div className="playback-controls">
              <button
                className="control-btn"
                onClick={handlePrevTrack}
                title="Previous Track"
                disabled={playlist.length <= 1}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="19,20 9,12 19,4" />
                  <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              <button
                className={`control-btn btn-play-pause ${currentMoodMapped}`}
                onClick={() => playlist.length > 0 && setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause" : "Play"}
                disabled={playlist.length === 0}
              >
                {isPlaying && playlist.length > 0 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,3 21,12 6,21" />
                  </svg>
                )}
              </button>

              <button
                className="control-btn"
                onClick={handleNextTrack}
                title="Next Track"
                disabled={playlist.length <= 1}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,4 15,12 5,20" />
                  <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Volume controller */}
            <div className="volume-control">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                title="Volume"
              />
            </div>

            {/* Equalizer Wave decoration */}
            <div className="equalizer">
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
              <div className={`bar ${currentMoodMapped} ${isPlaying && playlist.length > 0 ? "dancing" : ""}`}></div>
            </div>

            {/* Scrolling Track List Queue */}
            <div className="tracklist-container">
              <h4 className="tracklist-header">
                {isLoadingSong ? "Fetching Playlist..." : `Playlist Queue (${playlist.length})`}
              </h4>
              <div className="tracklist-scroll">
                {isLoadingSong ? (
                  <>
                    <div className="tracklist-item skeleton-item">
                      <span className="track-index skeleton-square"></span>
                      <span className="track-title-text skeleton-line"></span>
                      <span className="track-badge skeleton-pill"></span>
                    </div>
                    <div className="tracklist-item skeleton-item">
                      <span className="track-index skeleton-square"></span>
                      <span className="track-title-text skeleton-line"></span>
                      <span className="track-badge skeleton-pill"></span>
                    </div>
                    <div className="tracklist-item skeleton-item">
                      <span className="track-index skeleton-square"></span>
                      <span className="track-title-text skeleton-line"></span>
                      <span className="track-badge skeleton-pill"></span>
                    </div>
                  </>
                ) : playlist.length === 0 ? (
                  <div className="empty-tracklist-placeholder">
                    <p className="primary-text">No tracks for this vibe yet</p>
                    <p className="secondary-text">Upload .mp3 files with the mood tag "{currentMoodMapped}" to the database API to play them here.</p>
                  </div>
                ) : (
                  playlist.map((track, idx) => {
                    const isActive = idx === currentTrackIndex
                    return (
                      <div
                        key={track._id || idx}
                        className={`tracklist-item ${isActive ? "active" : ""} ${currentMoodMapped}`}
                        onClick={() => {
                          setCurrentTrackIndex(idx)
                          setIsPlaying(true)
                        }}
                      >
                        <span className="track-index">
                          {isActive && isPlaying ? (
                            <span className="visualizer-mini">
                              <span className="vbar"></span>
                              <span className="vbar"></span>
                              <span className="vbar"></span>
                            </span>
                          ) : idx + 1}
                        </span>
                        <span className="track-title-text" title={track.title}>
                          {track.title}
                        </span>
                        <span className="track-badge">{track.mood || currentMoodMapped}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Manual Mood Override Banner */}
      <footer className="manual-mood-banner">
        <h3 className="banner-title">Not your vibe? Select your mood manually</h3>

        <div className="mood-badges-grid">
          <button
            className={`mood-badge-btn happy ${currentMoodMapped === "happy" ? "active" : ""}`}
            onClick={() => {
              setExpression("Happy 😄")
              loadPlaylist("happy")
            }}
          >
            <span>😄</span> Happy
          </button>

          <button
            className={`mood-badge-btn sad ${currentMoodMapped === "sad" ? "active" : ""}`}
            onClick={() => {
              setExpression("Sad 😢")
              loadPlaylist("sad")
            }}
          >
            <span>😢</span> Sad
          </button>

          <button
            className={`mood-badge-btn surprised ${currentMoodMapped === "surprised" ? "active" : ""}`}
            onClick={() => {
              setExpression("Surprised 😲")
              loadPlaylist("surprised")
            }}
          >
            <span>😲</span> Surprised
          </button>

          <button
            className={`mood-badge-btn neutral ${currentMoodMapped === "neutral" ? "active" : ""}`}
            onClick={() => {
              setExpression("Neutral")
              loadPlaylist("neutral")
            }}
          >
            <span>😐</span> Neutral
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Home
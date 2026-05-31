import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);

    const playSong = () => {
        
    };

    const value = {
        currentTrackIndex,
        setCurrentTrackIndex,
        isPlaying,
        setIsPlaying,
        playlist,
        setPlaylist,
    };

    return (
        <SongContext.Provider value={value}>
            {children}
        </SongContext.Provider>
    );
}; 
import {fetchSongByMood} from "../Service/song.api";
import { useState } from "react";
import { useEffect } from "react";

export const useSong = (mood) => {
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getSong = async () => {
            setLoading(true);
            try {
                const data = await fetchSongByMood(mood);
                setSong(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        getSong();
    }, [mood]);

    return { song, loading, error };
};

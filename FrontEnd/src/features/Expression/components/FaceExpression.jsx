import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/Utils";

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    
    // 🚀 THE FIX: Yeh stop-signal lagayega taaki loop toot sake
    const isInitializing = useRef(false); 

    const [expression, setExpression] = useState("Initializing Scanner...");

    useEffect(() => {
        const startCamera = async () => {
            // Agar video tag ready nahi hai ya pehle se init ho raha hai, toh laut jao
            if (!videoRef.current || isInitializing.current) return;

            try {
                isInitializing.current = true; // Turnt gate band karo taaki loop na bane
                setExpression("Loading MediaPipe models...");
                
                await init({ landmarkerRef, videoRef, streamRef });
                
                setExpression("Camera Ready! Click below to scan.");
            } catch (error) {
                console.error("Webcam trigger fail:", error);
                setExpression("Camera Error ❌");
                isInitializing.current = false; // Error aaye toh gate kholo retry ke liye
            }
        };

        // DOM ko render hone ke liye 300ms ka clean time denge
        const timer = setTimeout(() => {
            startCamera();
        }, 300);

        return () => {
            clearTimeout(timer);
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []); // Empty array, strictly runs once

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ 
                        width: "400px", 
                        borderRadius: "12px", 
                        transform: "scaleX(-1)", // Mirror effect
                        background: "#000" 
                    }}
                />
            </div>
            <h2 style={{ color: "#fff", marginTop: "15px" }}>{expression}</h2>
            
            {/* Tumhaara customized manual button system */}
            <button 
                onClick={() => { detect({ landmarkerRef, videoRef, setExpression }) }}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#e91e63",
                    color: "white",
                    border: "none",
                    marginTop: "10px"
                }}
            >
                Detect expression
            </button>
        </div>
    );
}
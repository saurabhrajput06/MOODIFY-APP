import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/Utils";

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Initializing Scanner...");

    useEffect(() => {
        const startCamera = async () => {
            // 🚀 Safety Check: Wait jab tak HTML ka video tag ready na ho jaye
            if (!videoRef.current) return;

            try {
                await init({ landmarkerRef, videoRef, streamRef });
                setExpression("Camera Ready! Click below to scan.");
            } catch (error) {
                console.error("Webcam trigger fail:", error);
                setExpression("Camera Error ❌");
            }
        };

        // 100ms ka chota sa gap taaki DOM safely load ho jaye aur error na aaye
        const timer = setTimeout(() => {
            startCamera();
        }, 100);

        return () => {
            clearTimeout(timer);
            
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

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
                        transform: "scaleX(-1)", // Mirror effect taaki use karne mein sahi lage
                        background: "#000" 
                    }}
                />
            </div>
            <h2 style={{ color: "#fff", marginTop: "15px" }}>{expression}</h2>
            
            {/* 🔥 Tumhaara pyara button as it is ready hai! */}
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
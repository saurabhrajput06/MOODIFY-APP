import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/Utils";

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const isInitialized = useRef(false); // 👈 Yeh track rakhega ki ek baar chalne ke baad dobara na chale

    const [expression, setExpression] = useState("Initializing Scanner...");

    useEffect(() => {
        const startCamera = async () => {
            // Agar pehle se chal raha hai ya videoRef null hai, toh bilkul mat chalao
            if (isInitialized.current || !videoRef.current) return;

            try {
                isInitialized.current = true; // Block loop immediately
                setExpression("Loading MediaPipe models...");
                
                await init({ landmarkerRef, videoRef, streamRef });
                
                setExpression("Camera Ready! Click below to scan.");
            } catch (error) {
                console.error("Webcam trigger fail:", error);
                setExpression("Camera Error ❌");
                isInitialized.current = false; // Error aaye toh reset karein
            }
        };

        // DOM ko video tag render karne ka poora mauka do
        const timer = setTimeout(() => {
            startCamera();
        }, 500); // 500ms tak wait karega, bilkul safe

        return () => {
            clearTimeout(timer);
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []); // Hook empty rakho taaki component mount par sirf ek baar chale

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
                        transform: "scaleX(-1)", 
                        background: "#000" 
                    }}
                />
            </div>
            <h2 style={{ color: "#fff", marginTop: "15px" }}>{expression}</h2>
            
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
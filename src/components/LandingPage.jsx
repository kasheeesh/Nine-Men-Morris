import React, { useRef, useState } from 'react';
import "./landingpage.css";
import { Link } from 'react-router-dom';
import landingVideo from "../assets/landingpg.mp4";
import backgroundAudio from "../public/sounds/arcademusic.mp3"; // Import your audio file
import speakerIcon from "../assets/volume-up.png"; // Speaker image
import noSoundIcon from "../assets/no-sound.png"; // No-sound image

const LandingPage = () => {
    const [isMuted, setIsMuted] = useState(true); // State to track mute/unmute
    const [audioStarted, setAudioStarted] = useState(false); // Track if audio has started
    const audioRef = useRef(null); // Reference to the audio element

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const startAudio = () => {
        if (audioRef.current && !audioStarted) {
            audioRef.current.play();
            setAudioStarted(true);
        }
    };

    return (
        <div className="landingpage" onClick={startAudio}>
            {/* Background video */}
            <video autoPlay loop muted className="background-video">
                <source src={landingVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Background audio */}
            <audio ref={audioRef} loop muted>
                <source src={backgroundAudio} type="audio/mp3" />
                Your browser does not support the audio tag.
            </audio>

            {/* Content over the video */}
            <div className="controls">
                <div className="container">
                    <Link to="/signup">
                        <button className="signuppage">Sign Up</button>
                    </Link>
                    <Link to="/login">
                        <button className="loginpage">Log in</button>
                    </Link>
                </div>
                <button onClick={toggleMute} className="mute-button">
                    <img
                        src={isMuted ? noSoundIcon : speakerIcon}
                        alt={isMuted ? "No Sound" : "Speaker"}
                        className="mute-icon"
                    />
                </button>
            </div>
        </div>
    );
};

export default LandingPage;

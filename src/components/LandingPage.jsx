import React from 'react';
import "./landingpage.css";
import { Link } from 'react-router-dom';
import landingVideo from "../assets/landingpg.mp4";
const LandingPage = () => {
    return (
        <>
            <div className="landingpage">
                {/* Background video */}
                <video autoPlay loop muted className="background-video">
                    <source src={landingVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <Link to="/games">
                <button className="startb">Get Started</button>
            </Link>
                {/* Content over the video */}
                
            </div>
        </>
    );
};

export default LandingPage;

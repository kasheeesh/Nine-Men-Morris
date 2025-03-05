import React from "react";
import NineMensMorrisAI from "./NineMensMorrisAI";  // Import the AI game logic

const PlayWithComputer = () => {
    return (
        <div>
            <h2>Nine Men's Morris - Play with Computer</h2>
            <NineMensMorrisAI /> {/* This renders the game board */}
        </div>
    );
};

export default PlayWithComputer;

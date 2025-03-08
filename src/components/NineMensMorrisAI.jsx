import React, { useState, useEffect } from "react";
import "./NineMenMorrisAI.css";
import sww from '../assets/sww.mp4';
import ArrowButton from "./BackButton";

const positions = [
    [40, 40], [260, 40], [480, 40],
    [40, 260], [480, 260],
    [40, 480], [260, 480], [480, 480],
    [120, 120], [260, 120], [400, 120],
    [120, 260], [400, 260],
    [120, 400], [260, 400], [400, 400],
    [180, 180], [260, 180], [340, 180],
    [180, 260], [340, 260],
    [180, 340], [260, 340], [340, 340]
];

const lines = [
    [[40, 40], [480, 40]], [[40, 260], [480, 260]], [[40, 480], [480, 480]],
    [[40, 40], [40, 480]], [[260, 40], [260, 480]], [[480, 40], [480, 480]],
    [[120, 120], [400, 120]], [[120, 260], [400, 260]], [[120, 400], [400, 400]],
    [[120, 120], [120, 400]], [[260, 120], [260, 400]], [[400, 120], [400, 400]],
    [[180, 180], [340, 180]], [[180, 260], [340, 260]], [[180, 340], [340, 340]],
    [[180, 180], [180, 340]], [[260, 180], [260, 340]], [[340, 180], [340, 340]]
];


const NineMensMorrisAI = () => {
    const [board, setBoard] = useState(Array(24).fill(null));
    const [turn, setTurn] = useState("user");
    const [phase, setPhase] = useState("placing");
    const [userPieces, setUserPieces] = useState(9);
    const [aiPieces, setAiPieces] = useState(9);
    const [millFormed, setMillFormed] = useState(false);
    const [message, setMessage] = useState("");

    const checkMill = (newBoard, player) => {
        return [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [9, 10, 11], [12, 13, 14], [15, 16, 17],
            [18, 19, 20], [21, 22, 23]
        ].some(mill => mill.every(index => newBoard[index] === player));
    };

    const handleClick = (index) => {
        if (millFormed || board[index] !== null || turn !== "user") return;
        const newBoard = [...board];
        newBoard[index] = "user";
        setBoard(newBoard);
        setUserPieces(userPieces - 1);
        if (checkMill(newBoard, "user")) {
            setMillFormed(true);
            setMessage("You formed a mill! Remove an AI piece.");
            return;
        }
        setTurn("ai");
    };

    const handleRemoveAiPiece = (index) => {
        if (board[index] === "ai") {
            const newBoard = [...board];
            newBoard[index] = null;
            setBoard(newBoard);
            setAiPieces(aiPieces - 1);
            setMillFormed(false);
            setMessage("");
            setTurn("ai");
        }
    };

    useEffect(() => {
        if (turn === "ai" && !millFormed) {
            setTimeout(() => {
                const emptySpots = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
                if (emptySpots.length > 0) {
                    const aiMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
                    const newBoard = [...board];
                    newBoard[aiMove] = "ai";
                    setBoard(newBoard);
                    setAiPieces(aiPieces - 1);
                }
                setTurn("user");
            }, 1000);
        }
    }, [turn, board]);

    return (

        
        <div className="gamebb relative flex items-center justify-center min-h-screen bg-gray-900">
            
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={sww} type="video/mp4" />
            </video>
        {/* <ArrowButton/> */}
        <div className="game-container">
            <h2>Nine Men's Morris - Play with AI</h2>
            <div>User Pieces: {userPieces} | AI Pieces: {aiPieces}</div>
            <div className="message">{message}</div>
            <svg width="500" height="500" className="game-board">
                {/* Draw board lines */}
                {lines.map(([start, end], index) => (
                    <line
                        key={index}
                        x1={start[0]} y1={start[1]}
                        x2={end[0]} y2={end[1]}
                        stroke="white" strokeWidth="4"
                    />
                ))}

                {/* Draw game pieces */}
                {positions.map(([x, y], index) => (
                    <g key={index}>
                        <circle
                            cx={x} cy={y} r={15}
                            fill={board[index] === "user" ? "blue" : board[index] === "ai" ? "red" : "white"}
                            stroke="black" strokeWidth="2"
                            className="piece"
                            onClick={() =>
                                millFormed && board[index] === "ai"
                                    ? handleRemoveAiPiece(index)
                                    : handleClick(index)
                            }
                        />
                    </g>
                ))}
            </svg>
        </div>
        </div>
    );
};

export default NineMensMorrisAI;

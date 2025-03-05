import React, { useState, useEffect } from "react";
import "./NineMenMorrisAI.css";

const NineMensMorrisAI = () => {
    const [board, setBoard] = useState(Array(24).fill(null));
    const [turn, setTurn] = useState("user");
    const [phase, setPhase] = useState("placing");
    const [userPieces, setUserPieces] = useState(9);
    const [aiPieces, setAiPieces] = useState(9);
    const [millFormed, setMillFormed] = useState(false);
    const [aiMillFormed, setAiMillFormed] = useState(false);
    const [message, setMessage] = useState("");

    const positions = [
        [50, 50], [250, 50], [450, 50],
        [50, 250], [250, 250], [450, 250],
        [50, 450], [250, 450], [450, 450],
        [100, 100], [250, 100], [400, 100],
        [100, 250], [400, 250],
        [100, 400], [250, 400], [400, 400],
        [150, 150], [250, 150], [350, 150],
        [150, 250], [350, 250],
        [150, 350], [250, 350], [350, 350]
    ];

    const mills = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [9, 10, 11], [12, 13, 14], [15, 16, 17],
        [18, 19, 20], [21, 22, 23],
        [0, 9, 17], [1, 10, 18], [2, 11, 19],
        [3, 12, 20], [4, 13, 21], [5, 14, 22],
        [6, 15, 23], [7, 16, 22], [8, 17, 23]
    ];

    const checkMill = (newBoard, player) => {
        return mills.some(mill => mill.every(index => newBoard[index] === player));
    };

    const handleClick = (index) => {
        if (millFormed || aiMillFormed) return;
        if (phase === "placing") {
            if (board[index] !== null || turn !== "user") return;
            const newBoard = [...board];
            newBoard[index] = "user";
            setBoard(newBoard);
            setUserPieces(userPieces - 1);
            if (checkMill(newBoard, "user")) {
                setMillFormed(true);
                setMessage("You formed a mill! Remove an opponent's piece.");
                return;
            }
            setTurn("ai");
            if (userPieces - 1 === 0 && aiPieces === 0) setPhase("moving");
        }
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
        if (turn === "ai" && !millFormed && !aiMillFormed) {
            setTimeout(() => {
                const emptySpots = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
                if (phase === "placing" && emptySpots.length > 0) {
                    const aiMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
                    const newBoard = [...board];
                    newBoard[aiMove] = "ai";
                    setBoard(newBoard);
                    setAiPieces(aiPieces - 1);
                    if (checkMill(newBoard, "ai")) {
                        setAiMillFormed(true);
                        setMessage("AI formed a mill! AI will remove your piece.");
                        setTimeout(() => {
                            const userPiecesToRemove = board.map((v, i) => v === "user" ? i : null).filter(v => v !== null);
                            if (userPiecesToRemove.length > 0) {
                                const removeIndex = userPiecesToRemove[Math.floor(Math.random() * userPiecesToRemove.length)];
                                newBoard[removeIndex] = null;
                                setBoard(newBoard);
                                setUserPieces(userPieces - 1);
                                setAiMillFormed(false);
                                setMessage("");
                            }
                        }, 1000);
                        return;
                    }
                    if (userPieces === 0 && aiPieces - 1 === 0) setPhase("moving");
                }
                setTurn("user");
            }, 1000);
        }
    }, [turn, board, userPieces, aiPieces]);

    return (
        <div className="game-container">
            <h2>Nine Men's Morris - Play with Computer</h2>
            <div>User Pieces: {userPieces} | AI Pieces: {aiPieces}</div>
            <div className="message">{message}</div>
            <svg width="500" height="500" className="game-board">
                {positions.map(([x, y], index) => (
                    <g key={index}>
                        <circle
                            cx={x} cy={y} r={15}
                            fill={board[index] === "user" ? "blue" : board[index] === "ai" ? "red" : "white"}
                            stroke="black" strokeWidth="2"
                            onClick={() => 
                                millFormed && board[index] === "ai" ? handleRemoveAiPiece(index) :
                                handleClick(index)
                            }
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default NineMensMorrisAI;

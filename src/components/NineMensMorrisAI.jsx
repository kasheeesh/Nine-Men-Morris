import React, { useState, useEffect } from "react";
import "./NineMenMorrisAI.css";
import sww from '../assets/sww.mp4';

// const positions = [
//     [50, 50], [250, 50], [450, 50],
//     [50, 250], [450, 250],
//     [50, 450], [250, 450], [450, 450],
//     [100, 100], [250, 100], [400, 100],
//     [100, 250], [400, 250],
//     [100, 400], [250, 400], [400, 400],
//     [150, 150], [250, 150], [350, 150],
//     [150, 250], [350, 250],
//     [150, 350], [250, 350], [350, 350]
// ];

// const lines = [
//     [[50, 50], [450, 50]], [[50, 250], [450, 250]], [[50, 450], [450, 450]],
//     [[50, 50], [50, 450]], [[250, 50], [250, 450]], [[450, 50], [450, 450]],
//     [[100, 100], [400, 100]], [[100, 250], [400, 250]], [[100, 400], [400, 400]],
//     [[100, 100], [100, 400]], [[250, 100], [250, 400]], [[400, 100], [400, 400]],
//     [[150, 150], [350, 150]], [[150, 250], [350, 250]], [[150, 350], [350, 350]],
//     [[150, 150], [150, 350]], [[250, 150], [250, 350]], [[350, 150], [350, 350]]
// ];

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
    const [userPieces, setUserPieces] = useState(9); // User's remaining pieces to place
    const [aiPieces, setAiPieces] = useState(9); // AI's remaining pieces to place
    const [millFlag, setMillFlag] = useState(false); // Track mill formation
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false); // Controls pop-up visibility
    const [isRemovePhase, setIsRemovePhase] = useState(false); // Track remove phase
    const [selectedPiece, setSelectedPiece] = useState(null); // Track selected piece for movement
    const [userScore, setUserScore] = useState(0); // Track user's score
    const [aiScore, setAiScore] = useState(0); // Track AI's score
    const [userMoves, setUserMoves] = useState(0); // Track user's moves
    const [aiMoves, setAiMoves] = useState(0); // Track AI's moves
    const [processedMills, setProcessedMills] = useState([]); // Track mills that have already been processed
    const boardStructure = [
        // Outer square
        { id: 0, x: 50, y: 50 },   // Top-left corner
        { id: 1, x: 250, y: 50 },  // Top-middle
        { id: 2, x: 450, y: 50 },  // Top-right corner
        { id: 3, x: 50, y: 250 },  // Middle-left
        { id: 4, x: 250, y: 250 }, // Center
        { id: 5, x: 450, y: 250 }, // Middle-right
        { id: 6, x: 50, y: 450 },  // Bottom-left corner
        { id: 7, x: 250, y: 450 }, // Bottom-middle
        { id: 8, x: 450, y: 450 }, // Bottom-right corner
    
        // Middle square
        { id: 9, x: 150, y: 150 },  // Top-left corner
        { id: 10, x: 250, y: 150 }, // Top-middle
        { id: 11, x: 350, y: 150 }, // Top-right corner
        { id: 12, x: 150, y: 250 }, // Middle-left
        { id: 13, x: 350, y: 250 }, // Middle-right
        { id: 14, x: 150, y: 350 }, // Bottom-left corner
        { id: 15, x: 250, y: 350 }, // Bottom-middle
        { id: 16, x: 350, y: 350 }, // Bottom-right corner
    
        // Inner square
        { id: 17, x: 200, y: 200 }, // Top-left corner
        { id: 18, x: 250, y: 200 }, // Top-middle
        { id: 19, x: 300, y: 200 }, // Top-right corner
        { id: 20, x: 200, y: 250 }, // Middle-left
        { id: 21, x: 300, y: 250 }, // Middle-right
        { id: 22, x: 200, y: 300 }, // Bottom-left corner
        { id: 23, x: 250, y: 300 }, // Bottom-middle
        { id: 24, x: 300, y: 300 }, // Bottom-right corner
    ];
    const mills = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [9, 10, 11], [12, 13, 14], [15, 16, 17], // Rows
        [18, 19, 20], [21, 22, 23], // Rows
        [0, 9, 21], [3, 10, 18], [6, 11, 15], // Columns
        [1, 4, 7], [16, 19, 22], [8, 12, 17], // Columns
        [5, 13, 20], [2, 14, 23] // Columns
    ];

    const adjacentSpots = [
        [1, 9], [0, 2, 4], [1, 14],
        [4, 10], [1, 3, 5, 7], [4, 13],
        [7, 11], [4, 6, 8], [7, 12],
        [0, 10, 21], [3, 9, 11, 18], [6, 10, 15],
        [8, 13, 17], [5, 12, 14, 20], [2, 13, 23],
        [11, 16], [15, 17, 19], [12, 16],
        [10, 19], [16, 18, 20, 22], [13, 19],
        [9, 22], [19, 21, 23], [14, 22]
    ];

    // Check if a mill is formed
    const checkMill = (newBoard, player) => {
        return mills.some(mill => mill.every(index => newBoard[index] === player));
    };

    // Check if a mill is newly formed and not already processed
    const checkNewMill = (newBoard, player) => {
        for (const mill of mills) {
            if (mill.every(index => newBoard[index] === player)) {
                const isProcessed = processedMills.some(processedMill =>
                    JSON.stringify(processedMill) === JSON.stringify(mill)
                );
                if (!isProcessed) {
                    setProcessedMills(prev => [...prev, mill]); // Mark this mill as processed
                    return true;
                }
            }
        }
        return false;
    };

    // Check if a piece can be removed (not part of a mill unless all pieces are in mills)
    const canRemovePiece = (board, player) => {
        const opponent = player === "user" ? "ai" : "user";
        const opponentPieces = board.map((piece, index) => piece === opponent ? index : null).filter(v => v !== null);

        // Check if all opponent pieces are in mills
        const allInMills = opponentPieces.every(index =>
            mills.some(mill => mill.includes(index) && mill.every(spot => board[spot] === opponent))
        );

        if (allInMills) {
            return opponentPieces; // All pieces are in mills, so any can be removed
        }

        // Otherwise, only pieces not in mills can be removed
        return opponentPieces.filter(index =>
            !mills.some(mill => mill.includes(index) && mill.every(spot => board[spot] === opponent))
        );
    };

    // Handle user clicks
    const handleClick = (index) => {
        if (isRemovePhase) {
            // Remove phase: User can remove an AI piece
            const removablePieces = canRemovePiece(board, "user");
            if (removablePieces.includes(index)) {
                const newBoard = [...board];
                newBoard[index] = null; // Remove the AI piece
                setBoard(newBoard);
                setIsRemovePhase(false); // End remove phase
                setMillFlag(false); // Reset millFlag
                setTurn("ai"); // Switch to AI's turn
                setUserScore(prev => prev + 10); // Add 10 points for removing an AI piece
            }
            return;
        }

        if (turn !== "user") {
            return;
        }

        if (userPieces > 0) {
            // Placement phase: User is placing a piece
            if (board[index] !== null) {
                return;
            }

            const newBoard = [...board];
            newBoard[index] = "user";
            setBoard(newBoard);
            setUserPieces(prev => prev - 1); // Decrement user's remaining pieces
            setUserMoves(prev => prev + 1); // Increment user's move count

            if (checkNewMill(newBoard, "user")) {
                setMillFlag(true); // Set millFlag to true
                setMessage("You formed a mill! Remove an AI piece.");
                setShowMessage(true); // Show pop-up message
                setIsRemovePhase(true); // Enter remove phase
                setUserScore(prev => prev + 10); // Add 10 points for forming a mill

                // Hide the pop-up message after 2 seconds
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            } else {
                setTurn("ai"); // Switch to AI's turn
            }
        } else {
            // Movement phase: User is moving a piece
            if (selectedPiece === null) {
                // Select a piece to move
                if (board[index] === "user") {
                    setSelectedPiece(index);
                }
            } else {
                // Move the selected piece to the new spot
                if (board[index] === null && adjacentSpots[selectedPiece].includes(index)) {
                    const newBoard = [...board];
                    newBoard[selectedPiece] = null; // Remove the piece from the old spot
                    newBoard[index] = "user"; // Place the piece on the new spot
                    setBoard(newBoard);
                    setSelectedPiece(null); // Reset selected piece
                    setUserMoves(prev => prev + 1); // Increment user's move count

                    if (checkNewMill(newBoard, "user")) {
                        setMillFlag(true); // Set millFlag to true
                        setMessage("You formed a mill! Remove an AI piece.");
                        setShowMessage(true); // Show pop-up message
                        setIsRemovePhase(true); // Enter remove phase
                        setUserScore(prev => prev + 10); // Add 10 points for forming a mill

                        // Hide the pop-up message after 2 seconds
                        setTimeout(() => {
                            setShowMessage(false);
                        }, 2000);
                    } else {
                        setTurn("ai"); // Switch to AI's turn
                    }
                }
            }
        }
    };

    // AI's move logic
    useEffect(() => {
        if (turn === "ai" && !millFlag && !isRemovePhase && aiMoves < 30) {
            setTimeout(() => {
                let newBoard = [...board];
                let aiMove = null;
                let aiFormedMill = false;

                if (aiPieces > 0) {
                    // Placement phase: AI is placing a piece
                    const emptySpots = newBoard
                        .map((v, i) => v === null ? i : null)
                        .filter(v => v !== null);

                    if (emptySpots.length > 0) {
                        aiMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
                        newBoard[aiMove] = "ai";
                        setBoard(newBoard);
                        setAiPieces(prev => prev - 1); // Decrement AI's remaining pieces
                        setAiMoves(prev => prev + 1); // Increment AI's move count

                        // Check if the AI formed a mill
                        if (checkNewMill(newBoard, "ai")) {
                            aiFormedMill = true;
                            setMillFlag(true); // Set millFlag to true
                        }
                    }
                } else {
                    // Movement phase: AI is moving a piece
                    const aiPiecesOnBoard = newBoard
                        .map((v, i) => v === "ai" ? i : null)
                        .filter(v => v !== null);

                    if (aiPiecesOnBoard.length > 0) {
                        const randomPiece = aiPiecesOnBoard[Math.floor(Math.random() * aiPiecesOnBoard.length)];
                        const adjacentEmptySpots = adjacentSpots[randomPiece].filter(index => newBoard[index] === null);

                        if (adjacentEmptySpots.length > 0) {
                            aiMove = adjacentEmptySpots[Math.floor(Math.random() * adjacentEmptySpots.length)];
                            newBoard[randomPiece] = null; // Remove the piece from the old spot
                            newBoard[aiMove] = "ai"; // Place the piece on the new spot
                            setBoard(newBoard);
                            setAiMoves(prev => prev + 1); // Increment AI's move count

                            // Check if the AI formed a mill
                            if (checkNewMill(newBoard, "ai")) {
                                aiFormedMill = true;
                                setMillFlag(true); // Set millFlag to true
                            }
                        }
                    }
                }

                if (aiFormedMill) {
                    setMessage("AI formed a mill! You lose a piece.");
                    setShowMessage(true); // Show pop-up message
                    setUserScore(prev => Math.max(prev - 10, 0)); // Deduct 10 points for losing a piece

                    // Hide the pop-up message after 2 seconds
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 2000);
                }
                setTurn("user"); // Switch back to user's turn
            }, 1000); // Delay AI's move by 1 second for visibility
        }
    }, [turn, board, aiPieces, aiMoves, millFlag, isRemovePhase]);

    // Check for winning condition
    useEffect(() => {
        const userPiecesOnBoard = board.filter(piece => piece === "user").length;
        const aiPiecesOnBoard = board.filter(piece => piece === "ai").length;

        // Check winning conditions only after all pieces are placed
        if (userPieces === 0 && aiPieces === 0) {
            if (userPiecesOnBoard <= 2) {
                setMessage("AI Wins! Game Over.");
                setShowMessage(true);
                setAiScore(prev => prev + 20); // Add 20 points for AI winning
            } else if (aiPiecesOnBoard <= 2) {
                setMessage("You Win! Game Over.");
                setShowMessage(true);
                setUserScore(prev => prev + 20); // Add 20 points for user winning
            }
        }
    }, [board, userPieces, aiPieces]);

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
        
        <div className="game-container">
            <h2>Nine Men's Morris - Play with Computer</h2>
            <div className="score">
                <div>User Score: {userScore}</div>
                <div>AI Score: {aiScore}</div>
                <div>User Pieces Left: {userPieces}/9</div>
                <div>AI Pieces Left: {aiPieces}/9</div>
                <div>User Moves: {userMoves}/30</div>
                <div>AI Moves: {aiMoves}/30</div>
            </div>
            {showMessage && (
                <div className="popup-message">
                    {message}
                </div>
            )}
            <div className="game-board">
                {boardStructure.map((spot) => (
                    <div
                        key={spot.id}
                        className={`board-spot ${board[spot.id]} ${selectedPiece === spot.id ? "selected" : ""} ${isRemovePhase && board[spot.id] === "ai" ? "removable" : ""}`}
                        style={{ left: `${spot.x}px`, top: `${spot.y}px` }}
                        onClick={() => handleClick(spot.id)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default NineMensMorrisAI;
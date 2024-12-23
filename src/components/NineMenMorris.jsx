// NineMensMorris.js
import React, { useState } from "react";
import GameBoard from "./GameBoard";
import GameInfo from "./GameInfo";
import { checkForMills, handlePiecePlacement, handlePieceMovement, isValidMove } from "./GameLogic";
import "./nine.css";
import '../App.css';

const adjacencyMap = {
  // Outer square adjacency
  O1: ["O2", "O8"],
  O2: ["O1", "O3", "M2"],
  O3: ["O2", "O4"],
  O4: ["O3", "O5", "M4"],
  O5: ["O4", "O6"],
  O6: ["O5", "O7", "M6"],
  O7: ["O6", "O8"],
  O8: ["O7", "O1", "M8"],
  // Middle square adjacency
  M1: ["M2", "M8"],
  M2: ["M1", "M3", "I2"],
  M3: ["M2", "M4"],
  M4: ["M3", "M5", "I4"],
  M5: ["M4", "M6"],
  M6: ["M5", "M7", "I6"],
  M7: ["M6", "M8"],
  M8: ["M7", "M1", "I8"],
  // Inner square adjacency
  I1: ["I2", "I8"],
  I2: ["I1", "I3","M2"],
  I3: ["I2", "I4"],
  I4: ["I3", "I5","M4"],
  I5: ["I4", "I6"],
  I6: ["I5", "I7","M6"],
  I7: ["I6", "I8"],
  I8: ["I7", "I1","M8"],
};
const millCombinations = [
    ["O1", "O2", "O3"],
    ["O3", "O4", "O5"],
    ["O5", "O6", "O7"],
    ["O7", "O8", "O1"],
    // Middle square mills
    ["M1", "M2", "M3"],
    ["M3", "M4", "M5"],
    ["M5", "M6", "M7"],
    ["M7", "M8", "M1"],
    // Inner square mills
    ["I1", "I2", "I3"],
    ["I3", "I4", "I5"],
    ["I5", "I6", "I7"],
    ["I7", "I8", "I1"],
    // Connections across squares
    ["O2", "M2", "I2"],
    ["O4", "M4", "I4"],
    ["O6", "M6", "I6"],
    ["O8", "M8", "I8"],
  ];


const NineMensMorris = () => {
   const outerSquarePoints = [
    { id: "O1", x: 5, y: 5 },
    { id: "O2", x: 50, y: 5 },
    { id: "O3", x: 95, y: 5 },
    { id: "O4", x: 95, y: 50 },
    { id: "O5", x: 95, y: 95 },
    { id: "O6", x: 50, y: 95 },
    { id: "O7", x: 5, y: 95 },
    { id: "O8", x: 5, y: 50 },
  ];

  const middleSquarePoints = [
    { id: "M1", x: 20, y: 20 },
    { id: "M2", x: 50, y: 20 },
    { id: "M3", x: 80, y: 20 },
    { id: "M4", x: 80, y: 50 },
    { id: "M5", x: 80, y: 80 },
    { id: "M6", x: 50, y: 80 },
    { id: "M7", x: 20, y: 80 },
    { id: "M8", x: 20, y: 50 },
  ];

  const innerSquarePoints = [
    { id: "I1", x: 35, y: 35 },
    { id: "I2", x: 50, y: 35 },
    { id: "I3", x: 65, y: 35 },
    { id: "I4", x: 65, y: 50 },
    { id: "I5", x: 65, y: 65 },
    { id: "I6", x: 50, y: 65 },
    { id: "I7", x: 35, y: 65 },
    { id: "I8", x: 35, y: 50 },
  ];

  const allPoints = [...outerSquarePoints, ...middleSquarePoints, ...innerSquarePoints];

  const [board, setBoard] = useState(
    allPoints.reduce((acc, point) => ({ ...acc, [point.id]: null }), {})
  );
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [mills, setMills] = useState([]);
  const [canRemove, setCanRemove] = useState(false);
  const [processedMills, setProcessedMills] = useState([]);
  const [remainingPieces, setRemainingPieces] = useState({
    player1: 9,
    player2: 9,
  });
  const [isMovingPhase, setIsMovingPhase] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

const handlePointClick = (pointId) => {
    if (canRemove) return; 

    if (!isMovingPhase) {
       
        if (remainingPieces[currentPlayer] > 0 && !board[pointId]) {
            const updatedBoard = handlePiecePlacement(
                board,
                pointId,
                currentPlayer,
                remainingPieces,
                setBoard,
                setRemainingPieces
            );

            const newMills = checkForMills(
                updatedBoard,
                currentPlayer,
                millCombinations,
                processedMills
            );
            if (newMills.length > 0) {
                setMills((prev) => [...prev, ...newMills]);
                setProcessedMills((prev) => [
                    ...prev,
                    ...newMills.map((mill) => mill.join("-")),
                ]);
                setCanRemove(true); 
                if (remainingPieces.player1 === 0 || remainingPieces.player2 === 0) {
                    setIsMovingPhase(true);
                }
                return;
            }
            if (remainingPieces.player1 === 0 || remainingPieces.player2 === 0) {
                setIsMovingPhase(true);
            }

            setCurrentPlayer((prev) =>
                prev === "player1" ? "player2" : "player1"
            );
        }
    } else {
      
        if (selectedPiece === null) {
        
            if (board[pointId] === currentPlayer) {
                setSelectedPiece(pointId);
            } else {
                alert("Select one of your pieces to move.");
            }
        } else {
            if (isValidMove(selectedPiece, pointId, adjacencyMap, board)) {
                const updatedBoard = {
                    ...board,
                    [selectedPiece]: null,
                    [pointId]: currentPlayer,
                };
                setBoard(updatedBoard);
                const newMills = checkForMills(
                    updatedBoard,
                    currentPlayer,
                    millCombinations,
                    processedMills
                );
                if (newMills.length > 0) {
                    setMills((prev) => [...prev, ...newMills]);
                    setProcessedMills((prev) => [
                        ...prev,
                        ...newMills.map((mill) => mill.join("-")),
                    ]);
                    setCanRemove(true); 
                    setSelectedPiece(null);

                    return; 
                }
                setSelectedPiece(null);
                setCurrentPlayer((prev) =>
                    prev === "player1" ? "player2" : "player1"
                );
            } else {
                alert("Invalid move. You can only move to an adjacent empty point.");
            }
        }
    }
};

  

  const handleRemoveChecker = (pointId) => {
    if (!canRemove || !board[pointId]) return;

    const opponent = currentPlayer === "player1" ? "player2" : "player1";
    if (board[pointId] !== opponent) return;

    const isPartOfMill = millCombinations.some((mill) =>
      mill.includes(pointId) && mill.every((point) => board[point] === opponent)
    );

    const nonMillPieces = Object.entries(board).filter(
      ([id, player]) =>
        player === opponent &&
        !millCombinations.some((mill) => mill.includes(id) && mill.every((p) => board[p] === opponent))
    );

    if (isPartOfMill && nonMillPieces.length > 0) {
      alert("You cannot remove a piece from a mill unless no other pieces are available.");
      return;
    }

    const updatedBoard = { ...board, [pointId]: null };
    setBoard(updatedBoard);
    setCanRemove(false);
    setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));

    setMills([]);
  };

  return (
    <div className="game">
      <GameBoard
        allPoints={allPoints}
        board={board}
        mills={mills}
        canRemove={canRemove}
        handlePointClick={handlePointClick}
        handleRemoveChecker={handleRemoveChecker}
      />
      <GameInfo
        currentPlayer={currentPlayer}
        remainingPieces={remainingPieces}
        isMovingPhase={isMovingPhase}
        canRemove={canRemove}
      />
    </div>
  );
};

export default NineMensMorris;

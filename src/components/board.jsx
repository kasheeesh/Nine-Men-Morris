// import React, { useState } from "react";
// import "./nine.css";

// const NineMensMorris = () => {
//   const outerSquarePoints = [
//     { id: "O1", x: 5, y: 5 },
//     { id: "O2", x: 50, y: 5 },
//     { id: "O3", x: 95, y: 5 },
//     { id: "O4", x: 95, y: 50 },
//     { id: "O5", x: 95, y: 95 },
//     { id: "O6", x: 50, y: 95 },
//     { id: "O7", x: 5, y: 95 },
//     { id: "O8", x: 5, y: 50 },
//   ];

//   const middleSquarePoints = [
//     { id: "M1", x: 20, y: 20 },
//     { id: "M2", x: 50, y: 20 },
//     { id: "M3", x: 80, y: 20 },
//     { id: "M4", x: 80, y: 50 },
//     { id: "M5", x: 80, y: 80 },
//     { id: "M6", x: 50, y: 80 },
//     { id: "M7", x: 20, y: 80 },
//     { id: "M8", x: 20, y: 50 },
//   ];

//   const innerSquarePoints = [
//     { id: "I1", x: 35, y: 35 },
//     { id: "I2", x: 50, y: 35 },
//     { id: "I3", x: 65, y: 35 },
//     { id: "I4", x: 65, y: 50 },
//     { id: "I5", x: 65, y: 65 },
//     { id: "I6", x: 50, y: 65 },
//     { id: "I7", x: 35, y: 65 },
//     { id: "I8", x: 35, y: 50 },
//   ];

//   const allPoints = [...outerSquarePoints, ...middleSquarePoints, ...innerSquarePoints];

//   const millCombinations = [
//     // Outer square mills
//     ["O1", "O2", "O3"],
//     ["O3", "O4", "O5"],
//     ["O5", "O6", "O7"],
//     ["O7", "O8", "O1"],
//     // Middle square mills
//     ["M1", "M2", "M3"],
//     ["M3", "M4", "M5"],
//     ["M5", "M6", "M7"],
//     ["M7", "M8", "M1"],
//     // Inner square mills
//     ["I1", "I2", "I3"],
//     ["I3", "I4", "I5"],
//     ["I5", "I6", "I7"],
//     ["I7", "I8", "I1"],
//     // Connections across squares
//     ["O1", "M1", "I1"],
//     ["O3", "M3", "I3"],
//     ["O5", "M5", "I5"],
//     ["O7", "M7", "I7"],
//   ];

//   // Game state
//   const [board, setBoard] = useState(
//     allPoints.reduce((acc, point) => ({ ...acc, [point.id]: null }), {})
//   ); // Each point is either null, 'player1', or 'player2'
//   const [currentPlayer, setCurrentPlayer] = useState("player1");
//   const [mills, setMills] = useState([]);

//   // Check if a player has formed a mill
//   const checkForMills = (updatedBoard) => {
//     const newMills = millCombinations.filter((mill) =>
//       mill.every((point) => updatedBoard[point] === currentPlayer)
//     );
//     return newMills;
//   };

//   // Handle placing a piece
//   const handlePointClick = (pointId) => {
//     if (!board[pointId]) {
//       const updatedBoard = { ...board, [pointId]: currentPlayer };
//       setBoard(updatedBoard);

//       // Check for mills
//       const newMills = checkForMills(updatedBoard);
//       if (newMills.length > 0) {
//         setMills((prev) => [...prev, ...newMills]);
//         alert(`${currentPlayer} formed a mill!`);
//       }

//       // Switch turn
//       setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//     }
//   };

//   return (
//     <div className="game-board">
//       {allPoints.map((point) => (
//         <div
//           key={point.id}
//           className={`point ${
//             board[point.id] === "player1" ? "red" : board[point.id] === "player2" ? "blue" : ""
//           } ${mills.flat().includes(point.id) ? "mill" : ""}`}
//           style={{ left: `${point.x}%`, top: `${point.y}%` }}
//           onClick={() => handlePointClick(point.id)}
//         ></div>
//       ))}
//       <svg className="connections" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
//          <line x1="200" y1="20" x2="200" y2="140" stroke="black" strokeWidth="1" />
//          <line x1="200" y1="260" x2="200" y2="380" stroke="black" strokeWidth="1" />
//          <line x1="20" y1="200" x2="140" y2="200" stroke="black" strokeWidth="1" />
//          <line x1="260" y1="200" x2="380" y2="200" stroke="black" strokeWidth="1" />
//        </svg>
//       <div className="square outer"></div>
//       <div className="square middle"></div>
//       <div className="square inner"></div>
//       <div className="info">
//         <p>Current Turn: {currentPlayer}</p>
//       </div>
//     </div>
//   );
// };

// export default NineMensMorris;

//<----------------------------------->

// import React, { useState } from "react";
// import "./nine.css";

// const NineMensMorris = () => {
//   const outerSquarePoints = [
//     { id: "O1", x: 5, y: 5 },
//     { id: "O2", x: 50, y: 5 },
//     { id: "O3", x: 95, y: 5 },
//     { id: "O4", x: 95, y: 50 },
//     { id: "O5", x: 95, y: 95 },
//     { id: "O6", x: 50, y: 95 },
//     { id: "O7", x: 5, y: 95 },
//     { id: "O8", x: 5, y: 50 },
//   ];

//   const middleSquarePoints = [
//     { id: "M1", x: 20, y: 20 },
//     { id: "M2", x: 50, y: 20 },
//     { id: "M3", x: 80, y: 20 },
//     { id: "M4", x: 80, y: 50 },
//     { id: "M5", x: 80, y: 80 },
//     { id: "M6", x: 50, y: 80 },
//     { id: "M7", x: 20, y: 80 },
//     { id: "M8", x: 20, y: 50 },
//   ];

//   const innerSquarePoints = [
//     { id: "I1", x: 35, y: 35 },
//     { id: "I2", x: 50, y: 35 },
//     { id: "I3", x: 65, y: 35 },
//     { id: "I4", x: 65, y: 50 },
//     { id: "I5", x: 65, y: 65 },
//     { id: "I6", x: 50, y: 65 },
//     { id: "I7", x: 35, y: 65 },
//     { id: "I8", x: 35, y: 50 },
//   ];

//   const allPoints = [...outerSquarePoints, ...middleSquarePoints, ...innerSquarePoints];

//   const millCombinations = [
//     // Outer square mills
//     ["O1", "O2", "O3"],
//     ["O3", "O4", "O5"],
//     ["O5", "O6", "O7"],
//     ["O7", "O8", "O1"],
//     // Middle square mills
//     ["M1", "M2", "M3"],
//     ["M3", "M4", "M5"],
//     ["M5", "M6", "M7"],
//     ["M7", "M8", "M1"],
//     // Inner square mills
//     ["I1", "I2", "I3"],
//     ["I3", "I4", "I5"],
//     ["I5", "I6", "I7"],
//     ["I7", "I8", "I1"],
//     // Connections across squares
//     ["O1", "M1", "I1"],
//     ["O3", "M3", "I3"],
//     ["O5", "M5", "I5"],
//     ["O7", "M7", "I7"],
//   ];

//   // Game state
//   const [board, setBoard] = useState(
//     allPoints.reduce((acc, point) => ({ ...acc, [point.id]: null }), {})
//   ); // Each point is either null, 'player1', or 'player2'
//   const [currentPlayer, setCurrentPlayer] = useState("player1");
//   const [mills, setMills] = useState([]);
//   const [canRemove, setCanRemove] = useState(false);

//   // Check if a player has formed a mill
//   const checkForMills = (updatedBoard) => {
//     const newMills = millCombinations.filter((mill) =>
//       mill.every((point) => updatedBoard[point] === currentPlayer)
//     );
//     return newMills;
//   };

//   // Handle placing a piece
//   const handlePointClick = (pointId) => {
//     if (canRemove) return; // Skip if waiting for removal
//     if (!board[pointId]) {
//       const updatedBoard = { ...board, [pointId]: currentPlayer };
//       setBoard(updatedBoard);

//       // Check for mills
//       const newMills = checkForMills(updatedBoard);
//       if (newMills.length > 0) {
//         setMills((prev) => [...prev, ...newMills]);
//         alert(`${currentPlayer} formed a mill! Choose an opponent's piece to remove.`);
//         setCanRemove(true);
//         return;
//       }

//       // Switch turn
//       setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//     }
//   };

//   // Handle removing an opponent's piece
//   const handleRemoveChecker = (pointId) => {
//     if (!canRemove || !board[pointId]) return;

//     const opponent = currentPlayer === "player1" ? "player2" : "player1";
//     if (board[pointId] !== opponent) return;

//     // Check if the piece is part of a mill
//     const isPartOfMill = millCombinations.some((mill) =>
//       mill.includes(pointId) && mill.every((point) => board[point] === opponent)
//     );

//     // Allow removal if not part of a mill or no other non-mill pieces exist
//     const nonMillPieces = Object.entries(board).filter(
//       ([id, player]) =>
//         player === opponent &&
//         !millCombinations.some((mill) => mill.includes(id) && mill.every((p) => board[p] === opponent))
//     );

//     if (isPartOfMill && nonMillPieces.length > 0) {
//       alert("You cannot remove a piece from a mill unless no other pieces are available.");
//       return;
//     }

//     // Remove the piece
//     const updatedBoard = { ...board, [pointId]: null };
//     setBoard(updatedBoard);
//     setCanRemove(false);
//     setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//   };

//   return (
//     <div className="game-board">
//       {allPoints.map((point) => (
//         <div
//           key={point.id}
//           className={`point ${
//             board[point.id] === "player1" ? "red" : board[point.id] === "player2" ? "blue" : ""
//           } ${mills.flat().includes(point.id) ? "mill" : ""}`}
//           style={{ left: `${point.x}%`, top: `${point.y}%` }}
//           onClick={() => (canRemove ? handleRemoveChecker(point.id) : handlePointClick(point.id))}
//         ></div>
//       ))}
//       <svg className="connections" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
//           <line x1="200" y1="20" x2="200" y2="140" stroke="black" strokeWidth="1" />
//           <line x1="200" y1="260" x2="200" y2="380" stroke="black" strokeWidth="1" />
//           <line x1="20" y1="200" x2="140" y2="200" stroke="black" strokeWidth="1" />
//           <line x1="260" y1="200" x2="380" y2="200" stroke="black" strokeWidth="1" />
//         </svg>
//       <div className="square outer"></div>
//       <div className="square middle"></div>
//       <div className="square inner"></div>
//       <div className="info">
//         <p>Current Turn: {currentPlayer}</p>
//         {canRemove && <p>{currentPlayer}, remove an opponent's piece!</p>}
//       </div>
//     </div>
//   );
// };

// export default NineMensMorris;
//<-------------------------------------------->

import React, { useState } from "react";
import "./nine.css";

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

  const millCombinations = [
    // Outer square mills
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
    ["O1", "M1", "I1"],
    ["O3", "M3", "I3"],
    ["O5", "M5", "I5"],
    ["O7", "M7", "I7"],
  ];

  // Game state
  const [board, setBoard] = useState(
    allPoints.reduce((acc, point) => ({ ...acc, [point.id]: null }), {})
  );
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [mills, setMills] = useState([]);
  const [canRemove, setCanRemove] = useState(false);
  const [processedMills, setProcessedMills] = useState([]); // Track processed mills

  // Check if a player has formed a mill
  const checkForMills = (updatedBoard) => {
    const newMills = millCombinations.filter((mill) =>
      mill.every((point) => updatedBoard[point] === currentPlayer) &&
      !processedMills.includes(mill.join("-")) // Exclude processed mills
    );
    return newMills;
  };

  // Handle placing a piece
  const handlePointClick = (pointId) => {
    if (canRemove) return; // Skip if waiting for removal
    if (!board[pointId]) {
      const updatedBoard = { ...board, [pointId]: currentPlayer };
      setBoard(updatedBoard);

      // Check for mills
      const newMills = checkForMills(updatedBoard);
      if (newMills.length > 0) {
        setMills((prev) => [...prev, ...newMills]);
        setProcessedMills((prev) => [
          ...prev,
          ...newMills.map((mill) => mill.join("-")),
        ]); // Mark mill as processed
        // alert(`${currentPlayer} formed a mill! Choose an opponent's piece to remove.`);
        setCanRemove(true);
        return;
      }

      // Switch turn
      setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
    }
  };

  // Handle removing an opponent's piece
  const handleRemoveChecker = (pointId) => {
    if (!canRemove || !board[pointId]) return;

    const opponent = currentPlayer === "player1" ? "player2" : "player1";
    if (board[pointId] !== opponent) return;

    // Check if the piece is part of a mill
    const isPartOfMill = millCombinations.some((mill) =>
      mill.includes(pointId) && mill.every((point) => board[point] === opponent)
    );

    // Allow removal if not part of a mill or no other non-mill pieces exist
    const nonMillPieces = Object.entries(board).filter(
      ([id, player]) =>
        player === opponent &&
        !millCombinations.some((mill) => mill.includes(id) && mill.every((p) => board[p] === opponent))
    );

    if (isPartOfMill && nonMillPieces.length > 0) {
      alert("You cannot remove a piece from a mill unless no other pieces are available.");
      return;
    }

    // Remove the piece
    const updatedBoard = { ...board, [pointId]: null };
    setBoard(updatedBoard);
    setCanRemove(false);
    setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));

    // Reset mill highlights
    setMills([]);
  };

  return (
    <div className="game-board">
      {allPoints.map((point) => (
        <div
          key={point.id}
          className={`point ${
            board[point.id] === "player1" ? "red" : board[point.id] === "player2" ? "blue" : ""
          } ${mills.flat().includes(point.id) ? "mill" : ""}`}
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          onClick={() => (canRemove ? handleRemoveChecker(point.id) : handlePointClick(point.id))}
        ></div>
      ))}
      <svg className="connections" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
           <line x1="200" y1="20" x2="200" y2="140" stroke="black" strokeWidth="1" />
           <line x1="200" y1="260" x2="200" y2="380" stroke="black" strokeWidth="1" />
           <line x1="20" y1="200" x2="140" y2="200" stroke="black" strokeWidth="1" />
           <line x1="260" y1="200" x2="380" y2="200" stroke="black" strokeWidth="1" />
         </svg>
      <div className="square outer"></div>
      <div className="square middle"></div>
      <div className="square inner"></div>
      <div className="info">
        <p>Current Turn: {currentPlayer}</p>
        {canRemove && <p>{currentPlayer}, remove an opponent's piece!</p>}
      </div>
    </div>
  );
};

export default NineMensMorris;


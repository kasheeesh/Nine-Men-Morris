// // NineMensMorris.js
// import React, { useState} from "react";
// // import PrivateRoom from "./PrivateRoom";
// // import { io } from "socket.io-client";
// import GameBoard from "./GameBoard";
// import GameInfo from "./GameInfo";
// import sw from "../assets/sww.mp4"
// import { checkForMills, handlePiecePlacement, isValidMove, isValidFlying} from "./GameLogic";
// import "./nine.css";
// import '../App.css';


// const adjacencyMap = {
//   O1: ["O2", "O8"],
//   O2: ["O1", "O3", "M2"],
//   O3: ["O2", "O4"],
//   O4: ["O3", "O5", "M4"],
//   O5: ["O4", "O6"],
//   O6: ["O5", "O7", "M6"],
//   O7: ["O6", "O8"],
//   O8: ["O7", "O1", "M8"],
//   M1: ["M2", "M8"],
//   M2: ["M1", "M3", "I2", "O2"],
//   M3: ["M2", "M4"],
//   M4: ["M3", "M5", "I4", "O4"],
//   M5: ["M4", "M6"],
//   M6: ["M5", "M7", "I6", "O6"],
//   M7: ["M6", "M8"],
//   M8: ["M7", "M1", "I8", "O8"],
//   I1: ["I2", "I8"],
//   I2: ["I1", "I3", "M2"],
//   I3: ["I2", "I4"],
//   I4: ["I3", "I5", "M4"],
//   I5: ["I4", "I6"],
//   I6: ["I5", "I7", "M6"],
//   I7: ["I6", "I8"],
//   I8: ["I7", "I1", "M8"],
// };

// const millCombinations = [
//   ["O1", "O2", "O3"],
//   ["O3", "O4", "O5"],
//   ["O5", "O6", "O7"],
//   ["O7", "O8", "O1"],
//   ["M1", "M2", "M3"],
//   ["M3", "M4", "M5"],
//   ["M5", "M6", "M7"],
//   ["M7", "M8", "M1"],
//   ["I1", "I2", "I3"],
//   ["I3", "I4", "I5"],
//   ["I5", "I6", "I7"],
//   ["I7", "I8", "I1"],
//   ["O2", "M2", "I2"],
//   ["O4", "M4", "I4"],
//   ["O6", "M6", "I6"],
//   ["O8", "M8", "I8"],
// ];


// const NineMensMorris = () => {
//    const outerSquarePoints = [
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

//   const [board, setBoard] = useState(
//     allPoints.reduce((acc, point) => ({ ...acc, [point.id]: null }), {})
//   );
//   const [currentPlayer, setCurrentPlayer] = useState("player1");
//   const [mills, setMills] = useState([]);
//   const [canRemove, setCanRemove] = useState(false);
//   const [processedMills, setProcessedMills] = useState([]);
//   const [remainingPieces, setRemainingPieces] = useState({
//     player1: 9,
//     player2: 9,
//   });
//   const [isMovingPhase, setIsMovingPhase] = useState(false);
//   const [selectedPiece, setSelectedPiece] = useState(null);
//   const [isFlyingPhase, setIsFlyingPhase] = useState(false);  
//   const checkFlyingPhase = (board, player) => {
//   const playerPiecesCount = Object.values(board).filter((value) => value === player).length;
//   return playerPiecesCount === 3;
// };


// const isLoser = (board, player) => {
//   const playerPiecesCount = Object.values(board).filter((value) => value === player).length;
//   return playerPiecesCount === 2;
// }


// const handlePointClick = (pointId) => {
//     if (canRemove) return;
//     if(isLoser(board, currentPlayer) && isFlyingPhase){
//       let winner = "none";
//       if(currentPlayer == "player1"){
//         winner = "player2"
//       }else{
//         winner="player1"
//       }
//       console.log("Winner is:", winner);
//       return;
//     }
//     if(checkFlyingPhase(board, currentPlayer) && isMovingPhase){
//       setIsFlyingPhase(true);
//       if(selectedPiece === null){
//         if(board[pointId] === currentPlayer){
//           setSelectedPiece(pointId);
//         }else{
//           alert("Select one of your pieces to move");
//         }
//       }else{
//         const millsToRemove = processedMills.filter((mill) => 
//           mill.split("-").includes(selectedPiece));
//         setProcessedMills((prev) => prev.filter((mill) => !millsToRemove.includes(mill)));
//         if(isValidFlying(pointId, board)){

//           const updatedBoard = {
//                     ...board,
//                     [selectedPiece]: null,
//                     [pointId]: currentPlayer,
//                 };
//                 setBoard(updatedBoard);
//                 const newMills = checkForMills(
//                     updatedBoard,
//                     currentPlayer,
//                     millCombinations,
//                     processedMills
//                 );
//                 if (newMills.length > 0) {
//                     setMills((prev) => [...prev, ...newMills]);
//                     setProcessedMills((prev) => [
//                         ...prev,
//                         ...newMills.map((mill) => mill.join("-")),
//                     ]);
//                     setCanRemove(true);
//                     setSelectedPiece(null);
//                     return;
//                 }
//                 setSelectedPiece(null);
//                 setCurrentPlayer((prev) =>
//                     prev === "player1" ? "player2" : "player1"
//                 );
//         }
//         else{
//           alert("Invalid move. You can only move to an empty point.");
//         }
//       }

//     }
//     else if (!isMovingPhase) {
//         if (remainingPieces[currentPlayer] > 0 && !board[pointId]) {
//             const updatedBoard = handlePiecePlacement(
//                 board,
//                 pointId,
//                 currentPlayer,
//                 remainingPieces,
//                 setBoard,
//                 setRemainingPieces
//             );

//             const newMills = checkForMills(
//                 updatedBoard,
//                 currentPlayer,
//                 millCombinations,
//                 processedMills
//             );
//             if (newMills.length > 0) {
//                 setMills((prev) => [...prev, ...newMills]);
//                 setProcessedMills((prev) => [
//                     ...prev,
//                     ...newMills.map((mill) => mill.join("-")),
//                 ]);
//                 setCanRemove(true);
//                 if (remainingPieces.player1 === 0 || remainingPieces.player2 === 0) {
//                     setIsMovingPhase(true);
//                 }
//                 return;
//             }
//             if (remainingPieces.player1 === 0 || remainingPieces.player2 === 0) {
//                 setIsMovingPhase(true);
//             }

//             setCurrentPlayer((prev) =>
//                 prev === "player1" ? "player2" : "player1"
//             );
//         }
//     }
//      else if(isMovingPhase){
//         if (selectedPiece === null) {
//             if (board[pointId] === currentPlayer) {
//                 setSelectedPiece(pointId);
//             } else {
//                 alert("Select one of your pieces to move.");
//             }
//         } else {
//             // Remove mills that contain the selected piece before performing the move
//             const millsToRemove = processedMills.filter((mill) => 
//                 mill.split("-").includes(selectedPiece)
//             );

//             setProcessedMills((prev) => prev.filter((mill) => !millsToRemove.includes(mill)));

//             if (isValidMove(selectedPiece, pointId, adjacencyMap, board)) {
//                 const updatedBoard = {
//                     ...board,
//                     [selectedPiece]: null,
//                     [pointId]: currentPlayer,
//                 };
//                 setBoard(updatedBoard);
//                 const newMills = checkForMills(
//                     updatedBoard,
//                     currentPlayer,
//                     millCombinations,
//                     processedMills
//                 );
//                 if (newMills.length > 0) {
//                     setMills((prev) => [...prev, ...newMills]);
//                     setProcessedMills((prev) => [
//                         ...prev,
//                         ...newMills.map((mill) => mill.join("-")),
//                     ]);
//                     setCanRemove(true);
//                     setSelectedPiece(null);
//                     return;
//                 }
//                 setSelectedPiece(null);
//                 setCurrentPlayer((prev) =>
//                     prev === "player1" ? "player2" : "player1"
//                 );
//             } else {
//                 alert("Invalid move. You can only move to an adjacent empty point.");
//             }
//         }
//     }
// };
//   const handleRemoveChecker = (pointId) => {
//     if (!canRemove || !board[pointId]) return;

//     const opponent = currentPlayer === "player1" ? "player2" : "player1";
//     if (board[pointId] !== opponent) return;

//     const isPartOfMill = millCombinations.some((mill) =>
//       mill.includes(pointId) && mill.every((point) => board[point] === opponent)
//     );
    

//     const nonMillPieces = Object.entries(board).filter(
//       ([id, player]) =>
//         player === opponent &&
//         !millCombinations.some((mill) => mill.includes(id) && mill.every((p) => board[p] === opponent))
//     );

//     if (isPartOfMill && nonMillPieces.length > 0) {
//       alert("You cannot remove a piece from a mill unless no other pieces are available.");
//       return;
//     }

//     const updatedBoard = { ...board, [pointId]: null };
//     setBoard(updatedBoard);
//     setCanRemove(false);
//     setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
//     setMills([]);
//   };

//   return (
//     <div className="game-containerk">
//        <video autoPlay loop muted className="background-video">
//         <source src={sw} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       <div className="game">
//       <GameBoard
//         allPoints={allPoints}
//         board={board}
//         mills={mills}
//         canRemove={canRemove}
//         handlePointClick={handlePointClick}
//         handleRemoveChecker={handleRemoveChecker}
//       />

//       <GameInfo
//         currentPlayer={currentPlayer}
//         remainingPieces={remainingPieces}
//         isMovingPhase={isMovingPhase}
//         isFlyingPhase={isFlyingPhase}
//         canRemove={canRemove}
//       />
//     </div>
//     {/* Add chat below the game */}
//     {/* <div className="chat-container">
//       <PrivateRoom />
//     </div> */}
//     </div>
//   );
// };

// export default NineMensMorris;



import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import GameBoard from "./GameBoard";
import GameInfo from "./GameInfo";
import sw from "../assets/sww.mp4";
import { 
  checkForMills, 
  handlePiecePlacement, 
  isValidMove, 
  isValidFlying,
  countPlayerPieces,
  canRemovePiece,
  checkWinCondition,
  updateGameState
} from "./GameLogic";
import "./nine.css";
import '../App.css';

const adjacencyMap = {
  O1: ["O2", "O8"],
  O2: ["O1", "O3", "M2"],
  O3: ["O2", "O4"],
  O4: ["O3", "O5", "M4"],
  O5: ["O4", "O6"],
  O6: ["O5", "O7", "M6"],
  O7: ["O6", "O8"],
  O8: ["O7", "O1", "M8"],
  M1: ["M2", "M8"],
  M2: ["M1", "M3", "I2", "O2"],
  M3: ["M2", "M4"],
  M4: ["M3", "M5", "I4", "O4"],
  M5: ["M4", "M6"],
  M6: ["M5", "M7", "I6", "O6"],
  M7: ["M6", "M8"],
  M8: ["M7", "M1", "I8", "O8"],
  I1: ["I2", "I8"],
  I2: ["I1", "I3", "M2"],
  I3: ["I2", "I4"],
  I4: ["I3", "I5", "M4"],
  I5: ["I4", "I6"],
  I6: ["I5", "I7", "M6"],
  I7: ["I6", "I8"],
  I8: ["I7", "I1", "M8"],
};

const millCombinations = [
  ["O1", "O2", "O3"],
  ["O3", "O4", "O5"],
  ["O5", "O6", "O7"],
  ["O7", "O8", "O1"],
  ["M1", "M2", "M3"],
  ["M3", "M4", "M5"],
  ["M5", "M6", "M7"],
  ["M7", "M8", "M1"],
  ["I1", "I2", "I3"],
  ["I3", "I4", "I5"],
  ["I5", "I6", "I7"],
  ["I7", "I8", "I1"],
  ["O2", "M2", "I2"],
  ["O4", "M4", "I4"],
  ["O6", "M6", "I6"],
  ["O8", "M8", "I8"],
];

const NineMensMorris = () => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState("");
  const [gameStatus, setGameStatus] = useState("menu"); // menu, waiting, playing
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [canRemove, setCanRemove] = useState(false);
  const [mills, setMills] = useState([]);
  const [winner, setWinner] = useState(null);

  const allPoints = [
    // Outer square points
    { id: "O1", x: 5, y: 5 },
    { id: "O2", x: 50, y: 5 },
    { id: "O3", x: 95, y: 5 },
    { id: "O4", x: 95, y: 50 },
    { id: "O5", x: 95, y: 95 },
    { id: "O6", x: 50, y: 95 },
    { id: "O7", x: 5, y: 95 },
    { id: "O8", x: 5, y: 50 },
    // Middle square points
    { id: "M1", x: 20, y: 20 },
    { id: "M2", x: 50, y: 20 },
    { id: "M3", x: 80, y: 20 },
    { id: "M4", x: 80, y: 50 },
    { id: "M5", x: 80, y: 80 },
    { id: "M6", x: 50, y: 80 },
    { id: "M7", x: 20, y: 80 },
    { id: "M8", x: 20, y: 50 },
    // Inner square points
    { id: "I1", x: 35, y: 35 },
    { id: "I2", x: 50, y: 35 },
    { id: "I3", x: 65, y: 35 },
    { id: "I4", x: 65, y: 50 },
    { id: "I5", x: 65, y: 65 },
    { id: "I6", x: 50, y: 65 },
    { id: "I7", x: 35, y: 65 },
    { id: "I8", x: 35, y: 50 },
  ];

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("waiting", () => {
      setGameStatus("waiting");
    });

    newSocket.on("roomCreated", ({ roomId, role }) => {
      setPlayerRole(role);
      setRoomId(roomId);
      setGameStatus("waiting");
    });

    newSocket.on("roomJoined", ({ roomId, role }) => {
      setPlayerRole(role);
      setRoomId(roomId);
    });

    newSocket.on("gameStart", (game) => {
      setGameState(game);
      setGameStatus("playing");
    });

    newSocket.on("gameUpdate", (game) => {
      setGameState(game);
      setCanRemove(game.canRemove);
      setMills(game.mills || []);
    });

    newSocket.on("playerLeft", (message) => {
      alert(message);
      setGameStatus("menu");
      resetGame();
    });

    newSocket.on("roomError", (message) => {
      alert(message);
    });

    return () => newSocket.disconnect();
  }, []);

  const resetGame = () => {
    setGameState(null);
    setPlayerRole(null);
    setRoomId(null);
    setSelectedPiece(null);
    setCanRemove(false);
    setMills([]);
  };

  const createRoom = () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    const newRoomId = Math.random().toString(36).substr(2, 9);
    socket.emit("createRoom", { username, roomId: newRoomId });
  };

  const joinRoom = (roomToJoin) => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    socket.emit("joinRoom", { username, roomId: roomToJoin });
  };

  const joinRandom = () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    socket.emit("joinRandom", { username });
  };

  const handlePointClick = (pointId) => {
    if (!gameState || gameState.currentPlayer !== playerRole) return;
  
    if (canRemove) {
      handleRemoveChecker(pointId);
      return;
    }
  
    const currentState = { ...gameState };
    
    if (!currentState.isMovingPhase) {
      // Placement phase
      if (currentState.remainingPieces[playerRole] > 0 && !currentState.board[pointId]) {
        const updatedBoard = handlePiecePlacement(currentState.board, pointId, playerRole);
        
        if (updatedBoard === currentState.board) return; // Invalid placement
        
        const newMills = checkForMills(updatedBoard, playerRole, millCombinations, mills);
        
        const updatedState = {
          ...currentState,
          board: updatedBoard,
          remainingPieces: {
            ...currentState.remainingPieces,
            [playerRole]: currentState.remainingPieces[playerRole] - 1
          },
          canRemove: newMills.length > 0,
          mills: newMills,
          currentPlayer: newMills.length > 0 ? playerRole : (playerRole === "player1" ? "player2" : "player1"),
          isMovingPhase: 
            currentState.remainingPieces.player1 === 1 && 
            currentState.remainingPieces.player2 === 1
        };
  
        socket.emit("makeMove", { roomId, move: updatedState });
      }
    } else {
      // Moving phase
      if (selectedPiece === null) {
        if (currentState.board[pointId] === playerRole) {
          const playerPieceCount = countPlayerPieces(currentState.board, playerRole);
          const isFlying = playerPieceCount === 3;
          
          if (isFlying || adjacencyMap[pointId].some(adj => !currentState.board[adj])) {
            setSelectedPiece(pointId);
          }
        }
      } else {
        const updatedState = handlePlayerMove(currentState, selectedPiece, pointId, playerRole);
        if (updatedState !== currentState) { // Move was valid
          socket.emit("makeMove", { roomId, move: updatedState });
        }
        setSelectedPiece(null);
      }
    }
  };

  const handleMove = (from, to, currentState) => {
    const updatedState = updateGameState(
      currentState,
      from,
      to,
      playerRole,
      millCombinations
    );

    // Check for win condition after move
    const gameWinner = checkWinCondition(updatedState.board, playerRole);
    if (gameWinner) {
      updatedState.winner = gameWinner;
      setWinner(gameWinner);
    }

    socket.emit("makeMove", { roomId, move: updatedState });
  };

  const handleRemoveChecker = (pointId) => {
    if (!canRemove || !gameState.board[pointId]) return;

    const opponent = playerRole === "player1" ? "player2" : "player1";
    if (!canRemovePiece(pointId, gameState.board, playerRole, millCombinations)) {
      alert("Invalid piece removal - either piece is in mill or belongs to you");
      return;
    }

    const updatedState = {
      ...gameState,
      board: { ...gameState.board, [pointId]: null },
      canRemove: false,
      currentPlayer: playerRole === "player1" ? "player2" : "player1",
      mills: []
    };

    // Check for win condition after removal
    const gameWinner = checkWinCondition(updatedState.board, playerRole);
    if (gameWinner) {
      updatedState.winner = gameWinner;
      setWinner(gameWinner);
    }

    socket.emit("makeMove", { roomId, move: updatedState });
  };

  // Your existing render methods remain the same, but add winner display
  if (gameStatus === "playing" && winner) {
    return (
      <div className="game-over">
        <h2>Game Over!</h2>
        <p>{winner === playerRole ? "You Won!" : "You Lost!"}</p>
        <button onClick={resetGame} className="menu-button">Play Again</button>
      </div>
    );
  }

  if (gameStatus === "menu") {
    return (
      <div className="menu">
        <h2>Nine Men's Morris</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <button onClick={createRoom} className="menu-button">Create Room</button>
        <button onClick={joinRandom} className="menu-button">Join Random Game</button>
        <div className="join-room">
          <input
            type="text"
            placeholder="Room ID"
            onChange={(e) => setRoomId(e.target.value)}
            className="input-field"
          />
          <button onClick={() => joinRoom(roomId)} className="menu-button">Join Room</button>
        </div>
      </div>
    );
  }

  if (gameStatus === "waiting") {
    return (
      <div className="waiting">
        <h2>Waiting for opponent...</h2>
        {roomId && (
          <div className="room-info">
            <p>Room ID: {roomId}</p>
            <p>Share this ID with your friend to join the game</p>
          </div>
        )}
      </div>
    );
  }

    // Rest of your component remains the same
    return (
      <div className="game-containerk">
        <video autoPlay loop muted className="background-video">
          <source src={sw} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        <div className="game">
          <GameBoard
            allPoints={allPoints}
            board={gameState.board}
            mills={mills}
            canRemove={canRemove}
            handlePointClick={handlePointClick}
            selectedPiece={selectedPiece}
            playerRole={playerRole}
            currentPlayer={gameState.currentPlayer}
          />
  
          <GameInfo
            currentPlayer={gameState.currentPlayer}
            remainingPieces={gameState.remainingPieces}
            isMovingPhase={gameState.isMovingPhase}
            isFlyingPhase={gameState.isFlyingPhase}
            canRemove={canRemove}
            playerRole={playerRole}
            username={username}
            opponent={gameState.players?.find(p => p.role !== playerRole)?.username}
            winner={winner}
          />
        </div>
      </div>
    );
  };
  
  export default NineMensMorris;
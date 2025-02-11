// import React from "react";

// const GameInfo = ({ currentPlayer, remainingPieces, isMovingPhase, isFlyingPhase, canRemove }) => {
//   return (
//     <div className="info">
//       <p>Current Turn: {currentPlayer}</p>
//       <p>
//         Remaining Pieces - Player 1: {remainingPieces.player1}, Player 2:{" "}
//         {remainingPieces.player2}
//       </p>
//       {isFlyingPhase && <p>{currentPlayer}Flying phase Active</p>}
//       {isMovingPhase && <p>{currentPlayer} is in Moving Phase</p>}
//       {canRemove && <p>Remove an opponent's piece from the board.</p>}
//     </div>
//   );
// };

// export default GameInfo;


import React from "react";

const GameInfo = ({ 
  currentPlayer, 
  remainingPieces, 
  isMovingPhase, 
  isFlyingPhase, 
  canRemove, 
  playerRole,
  username,
  opponent
}) => {
  const isYourTurn = currentPlayer === playerRole;

  const getGamePhaseMessage = () => {
    if (canRemove) {
      return "Remove an opponent's piece";
    }
    if (!isMovingPhase) {
      return "Place your pieces on the board";
    }
    if (isFlyingPhase) {
      return "Flying phase - Move your piece to any empty position";
    }
    return "Move your pieces to adjacent positions";
  };

  return (
    <div className="info">
      <div className="players">
        <div className={`player ${playerRole === "player1" ? "you" : ""}`}>
          <h3>Player 1 {playerRole === "player1" ? "(You)" : ""}</h3>
          <p>{playerRole === "player1" ? username : opponent}</p>
          <p>Remaining Pieces: {remainingPieces.player1}</p>
        </div>
        <div className={`player ${playerRole === "player2" ? "you" : ""}`}>
          <h3>Player 2 {playerRole === "player2" ? "(You)" : ""}</h3>
          <p>{playerRole === "player2" ? username : opponent}</p>
          <p>Remaining Pieces: {remainingPieces.player2}</p>
        </div>
      </div>

      <div className="game-status">
        <h4>Game Status</h4>
        <p className={`turn-indicator ${isYourTurn ? "your-turn" : ""}`}>
          {isYourTurn ? "Your turn!" : "Opponent's turn"}
        </p>
        <p className="phase-message">{getGamePhaseMessage()}</p>
      </div>

      <div className="game-phase">
        <h4>Current Phase</h4>
        <p>
          {!isMovingPhase 
            ? "Placement Phase" 
            : isFlyingPhase 
              ? "Flying Phase" 
              : "Moving Phase"}
        </p>
      </div>
    </div>
  );
};

export default GameInfo;
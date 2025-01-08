import React from "react";

const GameInfo = ({ currentPlayer, remainingPieces, isMovingPhase, isFlyingPhase, canRemove }) => {
  return (
    <div className="info">
      <p>Current Turn: {currentPlayer}</p>
      <p>
        Remaining Pieces - Player 1: {remainingPieces.player1}, Player 2:{" "}
        {remainingPieces.player2}
      </p>
      {isFlyingPhase && <p>{currentPlayer}Flying phase Active</p>}
      {isMovingPhase && <p>{currentPlayer} is in Moving Phase</p>}
      {canRemove && <p>Remove an opponent's piece from the board.</p>}
    </div>
  );
};

export default GameInfo;

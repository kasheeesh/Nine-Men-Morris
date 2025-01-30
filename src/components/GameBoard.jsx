
import React from "react";
// import "./nine.css";

const GameBoard = ({ allPoints, board, mills, canRemove, handlePointClick, handleRemoveChecker }) => {
  return (
    <div className="startgame">
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
        <line x1="200" y1="20" x2="200" y2="140" stroke="white" strokeWidth="1" />
        <line x1="200" y1="260" x2="200" y2="380" stroke="white" strokeWidth="1" />
        <line x1="20" y1="200" x2="140" y2="200" stroke="white" strokeWidth="1" />
        <line x1="260" y1="200" x2="380" y2="200" stroke="white" strokeWidth="1" />
      </svg>
      <div className="square outer"></div>
      <div className="square middle"></div>
      <div className="square inner"></div>
    </div>
    </div>
  );
};

export default GameBoard;

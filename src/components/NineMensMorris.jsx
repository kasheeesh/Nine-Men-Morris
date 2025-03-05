import React, { useEffect, useState } from "react";

const NineMensMorris = ({ socket, roomCode }) => {
  const [moves, setMoves] = useState([]);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    socket.on("opponentMove", (move) => {
      setMoves((prevMoves) => [...prevMoves, move]);
      setTurn((prevTurn) => 1 - prevTurn);
    });

    return () => {
      socket.off("opponentMove");
    };
  }, [socket]);

  const makeMove = (move) => {
    if (turn === 0) {
      socket.emit("makeMove", roomCode, move);
      setMoves((prevMoves) => [...prevMoves, move]);
      setTurn(1);
    } else {
      alert("Wait for opponent's turn!");
    }
  };

  return (
    <div>
      <h2>Nine Men's Morris</h2>
      <p>Turn: {turn === 0 ? "Your Turn" : "Opponent's Turn"}</p>
      <button onClick={() => makeMove("Move1")}>Make Move</button>
      <p>Moves: {moves.join(", ")}</p>
    </div>
  );
};

export default NineMensMorris;

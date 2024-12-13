export const checkForMills = (updatedBoard, currentPlayer, millCombinations, processedMills) => {
  const newMills = millCombinations.filter((mill) =>
    mill.every((point) => updatedBoard[point] === currentPlayer) &&
    !processedMills.includes(mill.join("-"))
  );
  return newMills;
};

export const isValidMove = (selectedPiece, pointId, adjacencyMap, board) => {
  return adjacencyMap[selectedPiece].includes(pointId) && !board[pointId];
};

export const handlePiecePlacement = (board, pointId, currentPlayer, remainingPieces, setBoard, setRemainingPieces) => {
  const updatedBoard = { ...board, [pointId]: currentPlayer };
  setBoard(updatedBoard);

  setRemainingPieces((prev) => ({
    ...prev,
    [currentPlayer]: prev[currentPlayer] - 1,
  }));

  return updatedBoard;
};

export const handlePieceMovement = (board, selectedPiece, pointId, currentPlayer, setBoard, setSelectedPiece, setCurrentPlayer) => {
  const updatedBoard = { ...board, [selectedPiece]: null, [pointId]: currentPlayer };
  setBoard(updatedBoard);
  setSelectedPiece(null);
  setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
};

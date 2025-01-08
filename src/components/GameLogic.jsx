export const checkForMills = (updatedBoard, currentPlayer, millCombinations, processedMills) => {
  console.log("Checking for mills");
  console.log("Updated Board:", updatedBoard);
  console.log("Current Player:", currentPlayer);
  console.log("Processed Mills:", processedMills);
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

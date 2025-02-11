// export const checkForMills = (updatedBoard, currentPlayer, millCombinations, processedMills) => {
//   console.log("Checking for mills");
//   console.log("Updated Board:", updatedBoard);
//   console.log("Current Player:", currentPlayer);
//   console.log("Processed Mills:", processedMills);
//   const newMills = millCombinations.filter((mill) =>
//     mill.every((point) => updatedBoard[point] === currentPlayer) &&
//     !processedMills.includes(mill.join("-"))
//   );
//   return newMills;
// };


// export const isValidMove = (selectedPiece, pointId, adjacencyMap, board) => {
//   return adjacencyMap[selectedPiece].includes(pointId) && !board[pointId];
// };

// export const isValidFlying = (pointId, board) =>{
//   console.log("it is a valid move :", !board[pointId]);
//   return !board[pointId];
// }

// export const handlePiecePlacement = (board, pointId, currentPlayer, remainingPieces, setBoard, setRemainingPieces) => {
//   const updatedBoard = { ...board, [pointId]: currentPlayer };
//   setBoard(updatedBoard);

//   setRemainingPieces((prev) => ({
//     ...prev,
//     [currentPlayer]: prev[currentPlayer] - 1,
//   }));

//   return updatedBoard;
// };

// Constants for game configuration
export const PIECES_PER_PLAYER = 9;

// Check for mills (three pieces in a row)
export const checkForMills = (board, currentPlayer, millCombinations, existingMills = []) => {
  // Convert existing mills array to set of strings for efficient lookup
  const existingMillsSet = new Set(existingMills.map(mill => Array.isArray(mill) ? mill.join('-') : mill));
  
  // Find all possible mills for current player
  const newMills = millCombinations.filter(mill => {
    // Check if all points in the mill belong to current player
    const isMill = mill.every(point => board[point] === currentPlayer);
    // Check if this mill hasn't been processed before
    const millString = mill.join('-');
    return isMill && !existingMillsSet.has(millString);
  });

  return newMills;
};

// Check if a move is valid during normal moving phase
export const isValidMove = (fromPoint, toPoint, adjacencyMap, board) => {
  // Check if the destination is empty and is adjacent to the starting point
  if (!board || !adjacencyMap[fromPoint]) return false;
  return adjacencyMap[fromPoint].includes(toPoint) && !board[toPoint];
};

// Check if a flying move is valid (when player has only 3 pieces)
export const isValidFlying = (toPoint, board) => {
  // In flying phase, can move to any empty spot
  return !board[toPoint];
};

// Count pieces for a player
export const countPlayerPieces = (board, player) => {
  return Object.values(board).filter(piece => piece === player).length;
};

// Handle piece placement during the initial phase
export const handlePiecePlacement = (board, pointId, currentPlayer, remainingPieces) => {
  // Validate placement
  if (board[pointId] !== null && board[pointId] !== undefined) {
    return board; // Invalid placement, return unchanged board
  }
  
  // Create new board state with the new piece
  return {
    ...board,
    [pointId]: currentPlayer
  };
};

export const handlePlayerMove = (gameState, fromPoint, toPoint, currentPlayer) => {
  // Validate it's the player's turn
  if (gameState.currentPlayer !== currentPlayer) return gameState;
  
  // Validate piece belongs to current player
  if (gameState.board[fromPoint] !== currentPlayer) return gameState;
  
  const playerPieceCount = countPlayerPieces(gameState.board, currentPlayer);
  const isFlying = playerPieceCount === 3;
  
  // Validate move
  if (!isFlying && !isValidMove(fromPoint, toPoint, adjacencyMap, gameState.board)) {
    return gameState;
  }
  
  if (isFlying && !isValidFlying(toPoint, gameState.board)) {
    return gameState;
  }
  
  return updateGameState(gameState, fromPoint, toPoint, currentPlayer, millCombinations);
};

// Check if a piece can be removed
export const canRemovePiece = (pointId, board, currentPlayer, millCombinations) => {
  const opponent = currentPlayer === 'player1' ? 'player2' : 'player1';
  
  // Can't remove own pieces or empty spots
  if (board[pointId] !== opponent) return false;

  // Check if the piece is part of a mill
  const isInMill = millCombinations.some(mill => 
    mill.includes(pointId) && 
    mill.every(point => board[point] === opponent)
  );

  // If the piece is not in a mill, it can be removed
  if (!isInMill) return true;

  // If all opponent's pieces are in mills, then mills can be broken
  const allOpponentPieces = Object.entries(board)
    .filter(([_, player]) => player === opponent);
  
  const allInMills = allOpponentPieces.every(([id, _]) => 
    millCombinations.some(mill => 
      mill.includes(id) && 
      mill.every(point => board[point] === opponent)
    )
  );

  return allInMills;
};

// Check if a player can move
export const hasValidMoves = (board, player, adjacencyMap, isFlyingPhase) => {
  const playerPieces = Object.entries(board)
    .filter(([_, piece]) => piece === player)
    .map(([position, _]) => position);

  if (isFlyingPhase) {
    // In flying phase, just need one empty spot anywhere
    return Object.values(board).some(piece => piece === null);
  }

  // Check if any piece can move to an adjacent spot
  return playerPieces.some(piecePos => 
    adjacencyMap[piecePos].some(adjacent => !board[adjacent])
  );
};

// Check for win conditions
export const checkWinCondition = (board, currentPlayer) => {
  const opponent = currentPlayer === 'player1' ? 'player2' : 'player1';
  const opponentPieces = countPlayerPieces(board, opponent);
  
  // Only check for win conditions during the moving phase
  // (when all pieces have been placed)
  const totalPieces = countPlayerPieces(board, 'player1') + countPlayerPieces(board, 'player2');
  if (totalPieces < 18) return null; // Game still in placement phase
  
  // Win if opponent has less than 3 pieces
  if (opponentPieces < 3) return currentPlayer;
  
  // Check if opponent can move
  const opponentCanMove = hasValidMoves(board, opponent, adjacencyMap, opponentPieces === 3);
  if (!opponentCanMove) return currentPlayer;
  
  return null;
};

// Determine if player is in flying phase (has exactly 3 pieces)
export const isInFlyingPhase = (board, player) => {
  return countPlayerPieces(board, player) === 3;
};

// Get valid moves for a selected piece
export const getValidMoves = (board, selectedPiece, adjacencyMap, isFlyingPhase) => {
  if (isFlyingPhase) {
    return Object.keys(board).filter(pointId => !board[pointId]);
  }
  
  return adjacencyMap[selectedPiece].filter(pointId => !board[pointId]);
};

// Main game state update function
export const updateGameState = (currentState, fromPoint, toPoint, currentPlayer, millCombinations) => {
  const updatedBoard = { ...currentState.board };
  
  // Move the piece
  if (fromPoint) {
    updatedBoard[fromPoint] = null;
  }
  updatedBoard[toPoint] = currentPlayer;
  
  // Check for new mills
  const newMills = checkForMills(updatedBoard, currentPlayer, millCombinations, currentState.mills);
  
  // Don't change player turn if a mill was formed
  const shouldChangeTurn = newMills.length === 0;
  
  // Only check for win after a complete turn (after removing a piece if mill was formed)
  const winnerCheck = currentState.canRemove === true && !shouldChangeTurn ? 
    null : 
    checkWinCondition(updatedBoard, currentPlayer);

  return {
    ...currentState,
    board: updatedBoard,
    mills: newMills,
    canRemove: newMills.length > 0,
    currentPlayer: shouldChangeTurn ? (currentPlayer === 'player1' ? 'player2' : 'player1') : currentPlayer,
    winner: winnerCheck
  };
};

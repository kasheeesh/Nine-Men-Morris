// gameLogic.js
const validateMove = (gameState, move, playerId) => {

  console.log({
    currentPlayer: gameState.currentPlayer,
    movePlayer: move.currentPlayer,
    boardPieces: Object.values(move.board).filter(Boolean).length,
    remainingP1: move.remainingPieces.player1,
    remainingP2: move.remainingPieces.player2,
    expected: 18 - (move.remainingPieces.player1 + move.remainingPieces.player2),
    isMovingPhase: move.isMovingPhase
});

    // Validate turn order
    if (gameState.currentPlayer !== move.currentPlayer) return false;
    
    // Validate piece counts
    const totalPieces = Object.values(move.board).filter(Boolean).length;
    const expectedTotal = 18 - (move.remainingPieces.player1 + move.remainingPieces.player2);
    if (totalPieces !== expectedTotal) return false;
    
    // Validate phase transition
    if (move.isMovingPhase !== 
        (move.remainingPieces.player1 === 0 && move.remainingPieces.player2 === 0)) {
      return false;
    }
    
    return true;
  };
  
  const createInitialGameState = (roomId, player1) => ({
    gameId: roomId,
    players: [{ id: player1.id, username: player1.username, role: "player1" }],
    currentPlayer: "player1",
    board: {},
    remainingPieces: { player1: 9, player2: 9 },
    isMovingPhase: false,
    isFlyingPhase: false,
    mills: [],
    canRemove: false,
    winner: null,
    startTime: new Date()
  });
  
  const updateGameState = (currentState, move) => {
    return {
      ...currentState,
      board: move.board,
      currentPlayer: move.currentPlayer,
      remainingPieces: move.remainingPieces,
      isMovingPhase: move.isMovingPhase,
      isFlyingPhase: move.isFlyingPhase,
      mills: move.mills || [],
      canRemove: move.canRemove || false,
      winner: move.winner || null
    };
  };
  
  module.exports = {
    validateMove,
    createInitialGameState,
    updateGameState
  };
import { Board, Cell, Difficulty, GameConfig } from '../types/types';

export const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  [Difficulty.BEGINNER]: {
    rows: 8,
    cols: 8,
    mines: 10
  },
  [Difficulty.INTERMEDIATE]: {
    rows: 16,
    cols: 16,
    mines: 40
  },
  [Difficulty.EXPERT]: {
    rows: 16,
    cols: 30,
    mines: 99
  }
};

export const createBoard = (rows: number, cols: number, mines: number): Board => {
  // Initialize empty board
  let board: Board = Array(rows).fill(null).map((_, row) =>
    Array(cols).fill(null).map((_, col) => ({
      row,
      col,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols) {
              if (board[row + i][col + j].isMine) count++;
            }
          }
        }
        board[row][col].neighborMines = count;
      }
    }
  }

  return board;
};

export const revealCell = (board: Board, row: number, col: number): Board => {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return board;
  if (board[row][col].isRevealed || board[row][col].isFlagged) return board;

  const newBoard = board.map(row => [...row]);
  newBoard[row][col].isRevealed = true;

  if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        revealCell(newBoard, row + i, col + j);
      }
    }
  }

  return newBoard;
};

export const checkWin = (board: Board): boolean => {
  return board.every(row =>
    row.every(cell =>
      (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed)
    )
  );
};

export const countRemainingBlocks = (board: Board): number => {
  return board.reduce((total, row) => 
    total + row.reduce((rowTotal, cell) => 
      rowTotal + (cell.isRevealed ? 0 : 1), 0
    ), 0
  );
};
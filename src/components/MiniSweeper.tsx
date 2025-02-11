import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw as Refresh } from 'lucide-react';
import { Board as BoardType, GameStatus, Difficulty, GameConfig } from '../types/types';
import { createBoard, revealCell, checkWin, GAME_CONFIGS, countRemainingBlocks } from '../utils/mini';
import Cell from './Cell';

function MiniSweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [config, setConfig] = useState<GameConfig>(GAME_CONFIGS[Difficulty.BEGINNER]);
  const [board, setBoard] = useState<BoardType>(() => createBoard(config.rows, config.cols, config.mines));
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [firstClick, setFirstClick] = useState(true);
  const [time, setTime] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(config.mines);
  const remainingBlocks = countRemainingBlocks(board);

  useEffect(() => {
    let timer: number;
    if (gameStatus === GameStatus.PLAYING && !firstClick) {
      timer = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus, firstClick]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameStatus !== GameStatus.PLAYING || board[row][col].isFlagged) return;

    if (firstClick) {
      // Ensure first click is safe
      let newBoard = createBoard(config.rows, config.cols, config.mines);
      while (newBoard[row][col].isMine || newBoard[row][col].neighborMines !== 0) {
        newBoard = createBoard(config.rows, config.cols, config.mines);
      }
      setBoard(newBoard);
      setFirstClick(false);
      const revealedBoard = revealCell(newBoard, row, col);
      setBoard(revealedBoard);
      return;
    }

    if (board[row][col].isMine) {
      setGameStatus(GameStatus.LOST);
      // Reveal all mines
      setBoard(prev => prev.map(row =>
        row.map(cell => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed
        }))
      ));
      return;
    }

    const newBoard = revealCell(board, row, col);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setGameStatus(GameStatus.WON);
    }
  }, [board, gameStatus, firstClick, config]);

  const handleRightClick = useCallback((row: number, col: number) => {
    if (gameStatus !== GameStatus.PLAYING || board[row][col].isRevealed) return;

    setBoard(prev => {
      const newBoard = prev.map(r => [...r]);
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      return newBoard;
    });

    setFlagsLeft(prev => board[row][col].isFlagged ? prev + 1 : prev - 1);
  }, [board, gameStatus]);

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    const newConfig = GAME_CONFIGS[newDifficulty];
    setConfig(newConfig);
    resetGame(newConfig);
  };

  const resetGame = (newConfig?: GameConfig) => {
    const configToUse = newConfig || config;
    setBoard(createBoard(configToUse.rows, configToUse.cols, configToUse.mines));
    setGameStatus(GameStatus.PLAYING);
    setFirstClick(true);
    setTime(0);
    setFlagsLeft(configToUse.mines);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <div className="mb-4 space-y-4">
          <div className="flex justify-center space-x-4">
            {Object.values(Difficulty).map((d) => (
              <button
                key={d}
                onClick={() => changeDifficulty(d)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  difficulty === d
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Flags: {flagsLeft}
            </div>
            <button
              onClick={() => resetGame()}
              className="p-2 rounded-full hover:bg-gray-100"
              title="New Game"
            >
              <Refresh className="w-6 h-6" />
            </button>
            <div className="text-lg font-semibold">
              Time: {time}s
            </div>
          </div>
          
          <div className="text-lg font-semibold text-center">
            Remaining Blocks: {remainingBlocks}
          </div>
        </div>
        
        <div className="grid gap-px bg-gray-400 p-px" style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`
        }}>
          {board.map((row, i) => (
            row.map((cell, j) => (
              <Cell
                key={`${i}-${j}`}
                cell={cell}
                onClick={handleCellClick}
                onRightClick={handleRightClick}
              />
            ))
          ))}
        </div>

        {gameStatus !== GameStatus.PLAYING && (
          <div className="mt-4 text-center text-xl font-bold">
            {gameStatus === GameStatus.WON ? 'You Won! 🎉' : 'Game Over! 💣'}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiniSweeper;
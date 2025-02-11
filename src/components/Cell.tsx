import React from 'react';
import { Flag, Bomb } from 'lucide-react';
import { Cell as CellType } from '../types/types';

interface CellProps {
  cell: CellType;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = React.memo(({ cell, onClick, onRightClick }) => {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(cell.row, cell.col);
  };

  const getCellContent = () => {
    if (cell.isFlagged) return <Flag className="w-4 h-4 text-red-500" />;
    if (!cell.isRevealed) return null;
    if (cell.isMine) return <Bomb className="w-4 h-4 text-black" />;
    if (cell.neighborMines === 0) return null;
    return <span className="font-bold">{cell.neighborMines}</span>;
  };

  const getCellClass = () => {
    let className = "w-8 h-8 flex items-center justify-center border border-gray-400 ";
    if (!cell.isRevealed) {
      className += "bg-gray-200 hover:bg-gray-300 cursor-pointer";
    } else {
      className += "bg-white";
    }
    return className;
  };

  return (
    <div
      className={getCellClass()}
      onClick={() => onClick(cell.row, cell.col)}
      onContextMenu={handleRightClick}
    >
      {getCellContent()}
    </div>
  );
});

export default Cell;
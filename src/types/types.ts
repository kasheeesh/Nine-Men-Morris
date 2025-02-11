export interface Cell {
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
  }
  
  export type Board = Cell[][];
  
  export enum GameStatus {
    PLAYING = 'playing',
    WON = 'won',
    LOST = 'lost'
  }
  
  export enum Difficulty {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    EXPERT = 'expert'
  }
  
  export interface GameConfig {
    rows: number;
    cols: number;
    mines: number;
  }
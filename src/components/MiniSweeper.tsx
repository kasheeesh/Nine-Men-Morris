
import { useState, useCallback, useEffect } from "react"
import { Lightbulb, AlertTriangle } from "lucide-react"
import axios from "axios"
import videoBg from "../assets/minesweep.mp4";
import BackButton from "./BackButton.jsx";
enum Difficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERT = "expert",
}

enum GameStatus {
  PLAYING = "playing",
  WON = "won",
  LOST = "lost",
}

interface GameConfig {
  rows: number
  cols: number
  mines: number
}

const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  [Difficulty.BEGINNER]: { rows: 8, cols: 8, mines: 10 },
  [Difficulty.INTERMEDIATE]: { rows: 12, cols: 12, mines: 20 },
  [Difficulty.EXPERT]: { rows: 16, cols: 16, mines: 40 },
}

interface Cell {
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
  isHinted?: boolean
  isDangerHinted?: boolean
}

type Board = Cell[][]

const createBoard = (rows: number, cols: number, mines: number): Board => {
  const board: Board = Array(rows)
    .fill(null)
    .map((_, row) =>
      Array(cols)
        .fill(null)
        .map((_, col) => ({
          row,
          col,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          isHinted: false,
        }))
    )

  let minesPlaced = 0
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)
    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let neighbors = 0
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols) {
              if (board[row + i][col + j].isMine) neighbors++
            }
          }
        }
        board[row][col].neighborMines = neighbors
      }
    }
  }

  return board
}

const revealCell = (board: Board, row: number, col: number): Board => {
  const newBoard = board.map((r) => [...r])
  if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return newBoard

  newBoard[row][col].isRevealed = true

  if (newBoard[row][col].neighborMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (row + i >= 0 && row + i < board.length && col + j >= 0 && col + j < board[0].length) {
          revealCell(newBoard, row + i, col + j)
        }
      }
    }
  }

  return newBoard
}

const checkWin = (board: Board): boolean => {
  return board.every((row) =>
    row.every((cell) => (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed))
  )
}

const countRemainingBlocks = (board: Board): number => {
  return board.reduce((acc, row) => acc + row.reduce((rowAcc, cell) => rowAcc + (cell.isRevealed ? 0 : 1), 0), 0)
}

const MiniSweeper = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER)
  const [config, setConfig] = useState<GameConfig>(GAME_CONFIGS[Difficulty.BEGINNER])
  const [board, setBoard] = useState<Board>(() => createBoard(config.rows, config.cols, config.mines))
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING)
  const [firstClick, setFirstClick] = useState(true)
  const [time, setTime] = useState(0)
  const [flagsLeft, setFlagsLeft] = useState(config.mines)
  const [hintsLeft, setHintsLeft] = useState(3)
  const [hintType, setHintType] = useState<"safe" | "danger">("safe")
  const [score, setScore] = useState(0)
  const remainingBlocks = countRemainingBlocks(board)

  const calculateScore = useCallback(() => {
    const difficultyMultiplier = {
      [Difficulty.BEGINNER]: 1,
      [Difficulty.INTERMEDIATE]: 2,
      [Difficulty.EXPERT]: 3,
    }
    const revealedSafeCells = board.reduce(
      (acc, row) => acc + row.reduce((rowAcc, cell) => rowAcc + (!cell.isMine && cell.isRevealed ? 1 : 0), 0),
      0
    )
    const correctFlags = board.reduce(
      (acc, row) => acc + row.reduce((rowAcc, cell) => rowAcc + (cell.isMine && cell.isFlagged ? 1 : 0), 0),
      0
    )
    const timeBonus = Math.max(1000 - time * 2, 0)
    const calculatedScore = (revealedSafeCells * 10 + correctFlags * 20 + timeBonus) * difficultyMultiplier[difficulty]
    return Math.round(calculatedScore)
  }, [board, time, difficulty])

  useEffect(() => {
    let timer: number
    if (gameStatus === GameStatus.PLAYING && !firstClick) {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1)
        setScore(calculateScore())
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStatus, firstClick, calculateScore])

  const useHint = useCallback(() => {
    if (hintsLeft <= 0 || gameStatus !== GameStatus.PLAYING) return

    const safeCells: { row: number; col: number }[] = []
    const dangerCells: { row: number; col: number }[] = []
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell.isRevealed && !cell.isFlagged) {
          if (cell.isMine) {
            dangerCells.push({ row: i, col: j })
          } else {
            safeCells.push({ row: i, col: j })
          }
        }
      })
    })

    const cellsToUse = hintType === "safe" ? safeCells : dangerCells
    if (cellsToUse.length === 0) return

    const randomCell = cellsToUse[Math.floor(Math.random() * cellsToUse.length)]

    setBoard((prev) => {
      const newBoard = prev.map((row) => [...row])
      if (hintType === "safe") {
        newBoard[randomCell.row][randomCell.col].isHinted = true
      } else {
        newBoard[randomCell.row][randomCell.col].isDangerHinted = true
      }
      return newBoard
    })

    setTimeout(() => {
      setBoard((prev) => {
        const newBoard = prev.map((row) => [...row])
        if (hintType === "safe") {
          newBoard[randomCell.row][randomCell.col].isHinted = false
        } else {
          newBoard[randomCell.row][randomCell.col].isDangerHinted = false
        }
        return newBoard
      })
    }, 2000)

    setHintsLeft((prev) => prev - 1)
  }, [board, gameStatus, hintsLeft, hintType])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus !== GameStatus.PLAYING || board[row][col].isFlagged) return

      if (firstClick) {
        let newBoard = createBoard(config.rows, config.cols, config.mines)
        while (newBoard[row][col].isMine || newBoard[row][col].neighborMines !== 0) {
          newBoard = createBoard(config.rows, config.cols, config.mines)
        }
        setBoard(newBoard)
        setFirstClick(false)
        const revealedBoard = revealCell(newBoard, row, col)
        setBoard(revealedBoard)
        return
      }

      if (board[row][col].isMine) {
        setGameStatus(GameStatus.LOST)
        setBoard((prev) =>
          prev.map((row) =>
            row.map((cell) => ({
              ...cell,
              isRevealed: cell.isMine ? true : cell.isRevealed,
            }))
          )
        )
        return
      }

      const newBoard = revealCell(board, row, col)
      setBoard(newBoard)

      if (checkWin(newBoard)) {
        setGameStatus(GameStatus.WON)
      }
    },
    [board, gameStatus, firstClick, config]
  )

  const recordGamePlayed = useCallback(
    async (finalScore?: number) => {
      try {
        console.log("Recording MiniSweeper game played...")

        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No authentication token available")
          return
        }

        axios
          .post(
            "http://localhost:5000/handle-game-over",
            {
              gameName: "MiniSweeper",
              score: finalScore || score,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            console.log("Game recorded successfully:", response.data)
          })
          .catch((error) => {
            console.error("Error recording game played:", error)
          })
      } catch (error) {
        console.error("Error in recordGamePlayed function:", error)
      }
    },
    [score]
  )

  useEffect(() => {
    let timer: number | undefined

    if (gameStatus === GameStatus.PLAYING && !firstClick) {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1)
        setScore(calculateScore())
      }, 1000)
    } else if ((gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST) && !firstClick) {
      console.log(`Game ended with status: ${gameStatus}`)
      const finalScore = calculateScore()
      setScore(finalScore)
      recordGamePlayed(finalScore)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameStatus, firstClick, recordGamePlayed, calculateScore])

  const handleRightClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus !== GameStatus.PLAYING || board[row][col].isRevealed) return

      setBoard((prev) => {
        const newBoard = prev.map((r) => [...r])
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
        return newBoard
      })

      setFlagsLeft((prev) => (board[row][col].isFlagged ? prev + 1 : prev - 1))
    },
    [board, gameStatus]
  )

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    const newConfig = GAME_CONFIGS[newDifficulty]
    setConfig(newConfig)
    resetGame(newConfig)
  }

  const resetGame = (newConfig?: GameConfig) => {
    const configToUse = newConfig || config
    setBoard(createBoard(configToUse.rows, configToUse.cols, configToUse.mines))
    setGameStatus(GameStatus.PLAYING)
    setFirstClick(true)
    setTime(0)
    setFlagsLeft(configToUse.mines)
    setHintsLeft(3)
    setScore(0)
  }

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src={videoBg} type="video/mp4" />
    </video>  
   
    {/* Position the BackButton at the top left */}
    <div className="absolute top-4 left-4 z-10">
      <BackButton />
    </div>
      <div className="rounded-xl shadow-[0_0_20px_rgba(123,31,162,0.5)] bg-black border-4 border-purple-600">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan" />

          <div className="mb-4 space-y-4">
            <div className="flex justify-center space-x-4">
              {Object.values(Difficulty).map((d) => (
                <button
                  key={d}
                  onClick={() => changeDifficulty(d)}
                  className={`px-4 py-2 rounded-lg font-bold tracking-wider ${
                    difficulty === d
                      ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)] border-2 border-purple-400"
                      : "bg-purple-900 text-purple-200 hover:bg-purple-700 border-2 border-purple-700"
                  } transition-all duration-200 hover:scale-105`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center px-4 py-2 bg-purple-900/50 rounded-lg border-2 border-purple-700">
              <div className="text-2xl font-mono text-purple-200 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                🚩 {flagsLeft.toString().padStart(3, "0")}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setHintType("safe")}
                    className={`px-2 py-1 rounded-l-lg transition-all duration-200 ${
                      hintType === "safe" ? "bg-green-600 text-white" : "bg-purple-800 text-purple-200"
                    }`}
                  >
                    Safe
                  </button>
                  <button
                    onClick={() => setHintType("danger")}
                    className={`px-2 py-1 rounded-r-lg transition-all duration-200 ${
                      hintType === "danger" ? "bg-red-600 text-white" : "bg-purple-800 text-purple-200"
                    }`}
                  >
                    Danger
                  </button>
                </div>
                <button
                  onClick={useHint}
                  disabled={hintsLeft <= 0 || gameStatus !== GameStatus.PLAYING}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    hintsLeft > 0 && gameStatus === GameStatus.PLAYING
                      ? hintType === "safe"
                        ? "text-green-400 hover:text-green-300"
                        : "text-red-400 hover:text-red-300"
                      : "text-gray-600"
                  }`}
                  title={`Hints Left: ${hintsLeft}`}
                >
                  {hintType === "safe" ? <Lightbulb className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  <span className="text-sm font-mono">{hintsLeft}</span>
                </button>
              </div>
              <div className="text-2xl font-mono text-purple-200 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                ⏱️ {time.toString().padStart(3, "0")}
              </div>
              <div className="text-2xl font-mono text-purple-200 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                🏆 {score.toString().padStart(5, "0")}
              </div>
            </div>

            <div className="text-xl font-mono text-center text-purple-200 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              Blocks: {remainingBlocks.toString().padStart(3, "0")}
            </div>
          </div>

          <div
            className="grid gap-1 bg-purple-900/50 p-2 rounded-lg border-2 border-purple-700"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <Cell
                  key={`${i}-${j}`}
                  cell={cell}
                  onClick={() => handleCellClick(i, j)}
                  onRightClick={() => handleRightClick(i, j)}
                />
              ))
            )}
          </div>

          {gameStatus !== GameStatus.PLAYING && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
              <div className="bg-black/70 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4">
                  {gameStatus === GameStatus.WON ? "🎉 You Won! 🎉" : "💀 Game Over 💀"}
                </h2>
                <p className="text-2xl mb-4">
                  Final Score: <span className="font-bold text-purple-300">{score}</span>
                </p>
                <button
                  onClick={() => resetGame()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md transition-all duration-200 hover:scale-105"
                >
                  🔄 Restart Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Cell = ({ cell, onClick, onRightClick }: { cell: Cell; onClick: () => void; onRightClick: () => void }) => (
  <button
    onClick={onClick}
    onContextMenu={(e) => {
      e.preventDefault()
      onRightClick()
    }}
    className={`
      w-8 h-8 flex items-center justify-center font-bold text-lg transition-all duration-200
      ${
        cell.isRevealed
          ? "bg-purple-900 text-purple-200 shadow-inner"
          : "bg-purple-700 hover:bg-purple-600 transform hover:scale-105"
      }
      ${cell.isFlagged ? "text-red-400" : ""}
      ${cell.isHinted ? "bg-green-500/30 animate-pulse border-green-400" : ""}
      ${cell.isDangerHinted ? "bg-red-500/30 animate-pulse border-red-400" : ""}
      border-2 ${cell.isRevealed ? "border-purple-800" : "border-purple-500"}
      rounded-md
      ${cell.isHinted ? "shadow-[0_0_10px_rgba(34,197,94,0.5)]" : ""}
      ${cell.isDangerHinted ? "shadow-[0_0_10px_rgba(239,68,68,0.5)]" : ""}
    `}
  >
    {cell.isRevealed
      ? cell.isMine
        ? "💣"
        : cell.neighborMines || ""
      : cell.isFlagged
        ? "🚩"
        : cell.isHinted
          ? "✨"
          : cell.isDangerHinted
            ? "⚠️"
            : ""}
  </button>
)

export default MiniSweeper
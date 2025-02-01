import React, { useState, useEffect } from 'react';
import './lexiquest.css';
import words from '../assets/words.txt?raw';
import Modal from './ModalLexi';

// Get a seed based on the current date
const getDailySeed = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

// Seeded random number generator
const seededRandom = (seed) => {
  const x = Math.sin(Array.from(seed).reduce((a, c) => Math.imul(31, a) + c.charCodeAt(0) | 0, 0)) * 10000;
  return x - Math.floor(x);
};

// Generate consistent letter scores for the day
const generateDailyLetterScores = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const scores = {};
  const seed = getDailySeed();
  
  // Create array of numbers 1-26
  const numbers = Array.from({ length: 26 }, (_, i) => i + 1);
  
  // Fisher-Yates shuffle with seeded random
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  letters.split('').forEach((letter, index) => {
    scores[letter] = numbers[index];
  });

  return scores;
};

// Get daily vowel
const getDailyVowel = () => {
  const vowels = 'AEIOU';
  const seed = getDailySeed();
  return vowels[Math.floor(seededRandom(seed) * vowels.length)];
};

const Game = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [board, setBoard] = useState(Array(5).fill('').map(() => Array(5).fill('')));
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [letterScores] = useState(generateDailyLetterScores());
  const [goldenVowel] = useState(getDailyVowel());
  const [usedLettersByColumn, setUsedLettersByColumn] = useState(Array(5).fill(new Set()));
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const wordList = words.split("\n").map(word => word.trim().toUpperCase());
  const validWords = new Set(wordList);

  // Load saved game state on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('lexiquest-username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
      loadGameState(savedUsername);
    }
  }, []);

  // Load saved game state for a user
  const loadGameState = (user) => {
    const savedState = localStorage.getItem(`lexiquest-state-${user}-${getDailySeed()}`);
    if (savedState) {
      const state = JSON.parse(savedState);
      setBoard(state.board);
      setScores(state.scores);
      setTotalScore(state.totalScore);
      setCurrentRow(state.currentRow);
      setCurrentCol(state.currentCol);
      setUsedLettersByColumn(state.usedLettersByColumn.map(set => new Set(set)));
    }
  };

  // Save current game state
  const saveGameState = () => {
    if (!username) return;
    
    const gameState = {
      board,
      scores,
      totalScore,
      currentRow,
      currentCol,
      usedLettersByColumn: usedLettersByColumn.map(set => Array.from(set))
    };
    
    localStorage.setItem(`lexiquest-state-${username}-${getDailySeed()}`, JSON.stringify(gameState));
    
    // Save to leaderboard
    const leaderboard = JSON.parse(localStorage.getItem(`lexiquest-leaderboard-${getDailySeed()}`) || '{}');
    leaderboard[username] = totalScore;
    localStorage.setItem(`lexiquest-leaderboard-${getDailySeed()}`, JSON.stringify(leaderboard));
  };

  // Handle user login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('lexiquest-username', username);
      setIsLoggedIn(true);
      loadGameState(username);
    }
  };

  const handleKeyDown = (e) => {
    if (!isLoggedIn || currentRow >= 5) return;

    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (/^[A-Z]$/.test(key)) {
      handleLetterInput(key);
    } else if (key === 'ENTER') {
      handleSubmit();
    }
  };

  const handleBackspace = () => {
    if (currentCol > 0 || board[currentRow][currentCol]) {
      const newCol = currentCol === 0 ? 0 : currentCol - 1;
      const newBoard = [...board];
      newBoard[currentRow][newCol] = '';
      setBoard(newBoard);
      setCurrentCol(newCol);
      saveGameState();
    }
  };

  const handleLetterInput = (letter) => {
    for (let row = 0; row < currentRow; row++) {
      if (board[row][currentCol] === letter && letter !== goldenVowel) {
        return;
      }
    }

    if (currentCol < 5) {
      const newBoard = [...board];
      newBoard[currentRow][currentCol] = letter;
      setBoard(newBoard);
      setCurrentCol(currentCol + 1);
      saveGameState();
    }
  };

  const handleSubmit = () => {
    if (currentCol === 5) {
      const word = board[currentRow].join('');
      if (validWords.has(word)) {
        const score = calculateScore(word);
        updateUsedLetters(word);
        setScores([...scores, score]);
        setTotalScore(totalScore + score);
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
        saveGameState();
      } else {
        setModalMessage("Nice try! But that word doesn't exist in our dictionary.");
        setShowModal(true);
      }
    }
  };

  const calculateScore = (word) => {
    return word.split('').reduce((sum, letter) => {
      return sum + (letterScores[letter] || 0);
    }, 0);
  };

  const updateUsedLetters = (word) => {
    const newUsedLettersByColumn = [...usedLettersByColumn];
    word.split('').forEach((letter, colIndex) => {
      if (letter) {
        const newSet = new Set(newUsedLettersByColumn[colIndex]);
        newSet.add(letter);
        newUsedLettersByColumn[colIndex] = newSet;
      }
    });
    setUsedLettersByColumn(newUsedLettersByColumn);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const renderKeyboard = () => {
    const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

    const currentColumnUsedLetters = new Set();
    for (let row = 0; row < currentRow; row++) {
      if (board[row][currentCol] && board[row][currentCol] !== goldenVowel) {
        currentColumnUsedLetters.add(board[row][currentCol]);
      }
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="keyboard-row">
        {row.split('').map((letter) => {
          const isGoldenVowel = letter === goldenVowel;
          const isUsed = currentColumnUsedLetters.has(letter) && !isGoldenVowel;
          return (
            <div
              key={letter}
              className={`key ${isGoldenVowel ? 'golden' : ''} ${isUsed ? 'used' : ''}`}
            >
              {letter} <span className="score">{letterScores[letter] || ''}</span>
            </div>
          );
        })}
      </div>
    ));
  };

  const renderGrid = () => {
    return (
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${rowIndex === currentRow ? 'active' : ''}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game">
      {!isLoggedIn && (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button type="submit">Login</button>
        </form>
      )}

      {isLoggedIn && (
        <div className="game-play">
          {renderGrid()}
          {renderKeyboard()}
          {showModal && <Modal message={modalMessage} closeModal={closeModal} />}
        </div>
      )}
    </div>
  );
};

export default Game;

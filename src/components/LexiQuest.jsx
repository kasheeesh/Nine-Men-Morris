import React, { useState, useEffect } from 'react';
import './lexiquest.css';
import words from '../assets/words.txt?raw';
import Modal from './ModalLexi';

// Enhanced seeded random for letter scores and vowel
const seededRandom = (seed) => {
  const x = Math.sin(Array.from(seed).reduce((a, c) => Math.imul(31, a) + c.charCodeAt(0) | 0, 0)) * 10000;
  return x - Math.floor(x);
};

// Get a seed based on the current date and time
const getDailySeed = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}`;
};

// Generate consistent letter scores for the day with an added dynamic element
const generateDailyLetterScores = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const scores = {};
  const seed = getDailySeed();  // Enhanced seed with time-based variance
  
  // Create array of numbers 1-26
  const numbers = Array.from({ length: 26 }, (_, i) => i + 1);
  
  // Fisher-Yates shuffle with seeded random and extra randomness for variation
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  letters.split('').forEach((letter, index) => {
    scores[letter] = numbers[index];
  });

  return scores;
};

// Get a daily vowel with extra randomness
const getDailyVowel = () => {
  const vowels = 'AEIOU';
  const seed = getDailySeed();
  const randomIndex = Math.floor(seededRandom(seed) * vowels.length);
  return vowels[randomIndex];
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
  const [usedLettersByColumn, setUsedLettersByColumn] = useState(Array(5).fill().map(() => new Set()));
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const wordList = words.split("\n").map(word => word.trim().toUpperCase());
  const validWords = new Set(wordList);

  useEffect(() => {
    const savedUsername = localStorage.getItem('lexiquest-username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
      loadGameState(savedUsername);
    }

    const handleKeyDown = (e) => {
      if (!isLoggedIn || currentRow >= 5) return;
      const key = e.key.toUpperCase();

      if (key === 'BACKSPACE') handleBackspace();
      else if (/^[A-Z]$/.test(key)) handleLetterInput(key);
      else if (key === 'ENTER') handleSubmit();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn, currentRow, currentCol]);

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
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('lexiquest-username', username);
      setIsLoggedIn(true);
      loadGameState(username);
    }
  };

  const handleBackspace = () => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      newBoard[currentRow][Math.max(0, currentCol - 1)] = '';
      return newBoard;
    });
    setCurrentCol(prev => Math.max(0, prev - 1));
    saveGameState();
  };

  const handleLetterInput = (letter) => {
    if (currentCol < 5) {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => [...row]);
        newBoard[currentRow][currentCol] = letter;
        return newBoard;
      });
      setCurrentCol(prev => prev + 1);
      saveGameState();
    }
  };

  const handleSubmit = () => {
    if (currentCol === 5) {
      const word = board[currentRow].join('');
      if (validWords.has(word)) {
        const score = calculateScore(word);
        setScores(prevScores => [...prevScores, score]);
        setTotalScore(prev => prev + score);
        setCurrentRow(prev => prev + 1);
        setCurrentCol(0);
        saveGameState();
      } else {
        setModalMessage("Invalid word!");
        setShowModal(true);
      }
    }
  };

  const calculateScore = (word) => {
    return word.split('').reduce((sum, letter) => sum + (letterScores[letter] || 0), 0);
  };

  const closeModal = () => setShowModal(false);

  return !isLoggedIn ? (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button type="submit">Start Playing</button>
      </form>
    </div>
  ) : (
    <div className="app">
      <h2>Player: {username}</h2>
      <div className="grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((letter, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="cell">
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={currentRow >= 5 || currentCol < 5}>Submit Word</button>
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Game;

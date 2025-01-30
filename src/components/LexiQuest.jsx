import React, { useState } from 'react';
import './lexiquest.css';
import words from '../assets/words.txt?raw';
import Modal from './ModalLexi';
import lexi from "../assets/lexi.mp4"

// Generate random letter scores
const generateLetterScores = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const scores = {};
  const shuffledNumbers = Array.from({ length: 26 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
  
  letters.split('').forEach((letter, index) => {
    scores[letter] = shuffledNumbers[index];
  });

  return scores;
};

// Get a random vowel for the golden vowel
const getRandomVowel = () => {
  const vowels = 'AEIOU';
  return vowels[Math.floor(Math.random() * vowels.length)];
};

// Main Game Component
const Game = () => {
  const [board, setBoard] = useState(Array(5).fill('').map(() => Array(5).fill('')));
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [letterScores] = useState(generateLetterScores());
  const [goldenVowel] = useState(getRandomVowel());
  const [usedLettersByColumn, setUsedLettersByColumn] = useState(Array(5).fill(new Set()));
  const [showModal, setShowModal] = useState(false);  // State for modal visibility

  const wordList = words.split("\n").map(word => word.trim().toUpperCase());
  const validWords = new Set(wordList);

  // Handle key press events
  const handleKeyDown = (e) => {
    if (currentRow >= 5) return;

    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (/^[A-Z]$/.test(key)) {
      handleLetterInput(key);
    } else if (key === 'ENTER') {
      handleSubmit();
    }
  };

  // Handle BACKSPACE input
  const handleBackspace = () => {
    if (currentCol > 0 || board[currentRow][currentCol]) {
      const newCol = currentCol === 0 ? 0 : currentCol - 1;
      const newBoard = [...board];
      newBoard[currentRow][newCol] = '';
      setBoard(newBoard);
      setCurrentCol(newCol);
    }
  };

  const handleLetterInput = (letter) => {
  for (let row = 0; row < currentRow; row++) {
    if (board[row][currentCol] === letter && letter !== goldenVowel) {
      return; // Prevent reuse of letters in the same column unless it's the golden vowel
    }
  }

  if (currentCol < 5) {
    const newBoard = [...board];
    newBoard[currentRow][currentCol] = letter;
    setBoard(newBoard);
    setCurrentCol(currentCol + 1);
  }
};


  // Handle word submission
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
      } else {
        setShowModal(true);
      }
    }
  };

  // Calculate the score for a word
  const calculateScore = (word) => {
    return word.split('').reduce((sum, letter) => {
      return sum + (letterScores[letter] || 0);
    }, 0);
  };

  // Update the letters used in each column
  const updateUsedLetters = (word) => {
    const newUsedLettersByColumn = [...usedLettersByColumn];
    word.split('').forEach((letter, colIndex) => {
      if (letter) newUsedLettersByColumn[colIndex].add(letter);
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
            onClick={() => handleLetterInput(letter)} // Add onClick handler
          >
            {letter} <span className="score">{letterScores[letter]}</span>
          </div>
        );
      })}
    </div>
  ));
};


  return (
    <div className='game-containerk'>
      <video autoPlay loop muted className="background-video">
              <source src={lexi} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
      <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
  <div className="grid">
    {board.map((row, rowIndex) => (
      <div key={rowIndex} className="row-wrapper">
        <div className="row">
          {row.map((letter, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={`cell ${rowIndex === currentRow ? 'active' : ''}`}>
              {letter}
            </div>
          ))}
        </div>
        <div className="score-box">
          {rowIndex < scores.length ? scores[rowIndex] : ''}
        </div>
      </div>
    ))}
    <div className="total-score">{totalScore}</div>
  </div>

  <div className="keyboard">{renderKeyboard()}</div>
  <div className="sidebar">
    <button className = "submitbutt" onClick={handleSubmit} disabled={currentRow >= 5 || currentCol < 5}>
      Submit Word
    </button>
  </div>
  {showModal && (
    <Modal
      message="Nice try! But that word doesn't exist in our dictionary."
      onClose={closeModal}
    />
  )}
</div>
    </div>

  );
};

export default Game;

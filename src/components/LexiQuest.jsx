import React, { useState, useEffect} from 'react';
import './lexiquest.css';
import words from '../assets/words.txt?raw';
import Modal from './ModalLexi';
import lexi from "../assets/newdes.mp4"
import axios from 'axios'; // Import axios for API calls
import Button64 from './BackButton';
import './BackButton.css';

const getDailySeed = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

// Seeded random number generator
const seededRandom = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
  }
  const x = Math.sin(hash) * 10000;
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
    const j = Math.floor(seededRandom(seed + String(i)) * (i + 1));
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


// Main Game Component
const Game = () => {
  const [board, setBoard] = useState(Array(5).fill('').map(() => Array(5).fill('')));
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [letterScores] = useState(generateDailyLetterScores());
  const [goldenVowel] = useState(getDailyVowel());
  const [usedLettersByColumn, setUsedLettersByColumn] = useState(Array(5).fill(new Set()));
  const [showModal, setShowModal] = useState(false);  // State for modal visibility
  const[gameOver, setGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const[leaderboard, setLeaderboard] = useState([]);

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

  
  const isGameOver = () =>{
    if(currentRow >=5){
      const token = localStorage.getItem('token');
      console.log(totalScore);
      axios.post('http://localhost:5000/save-score-lexi', { totalScore }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => console.log('Score saved successfully'))
        .catch(err => console.error('Error saving score:', err));
      setGameOver(true);
      return;
    }
  }
  const handleLeaderboard = () => {
    axios.get('http://localhost:5000/leaderboardlexi')
      .then(response => {
        console.log(response.data);
        setLeaderboard(response.data);
        setShowLeaderboard(true);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
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
// import { useEffect, useState } from "react";


useEffect(() => {
    isGameOver();
}, [totalScore]);  // Runs whenever `score` changes



  return (
    <div className='game-containerk'>
      <Button64/>
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
  {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Game Over</h2>
            <p className="text-2xl">Final Score: {totalScore}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleLeaderboard}
            >
              View Leaderboard
            </button>
          </div>
        </div>
      )}
      {showLeaderboard && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Leaderboard</h2>
            <ul className="list-none">
              {leaderboard.map((entry, index) => (
                <li key={index} className="mb-2 text-lg">{`${index + 1}. ${entry.username} - ${entry.highestScore}`}</li>
              ))}
            </ul>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => setShowLeaderboard(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
</div>
    </div>

  );
};

export default Game;

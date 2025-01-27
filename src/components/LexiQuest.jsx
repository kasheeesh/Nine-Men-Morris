import React, { useState, useEffect } from 'react';
import './lexiquest.css';
import words from '../assets/words.txt?raw';
import Modal from './ModalLexi';

const generateDailySeed = () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
};

// Generate random letter scores based on seed
const generateLetterScores = (seed) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shuffledNumbers = Array.from({ length: 26 }, (_, i) => i + 1).sort(() => Math.random() - seed % 1);
  const scores = {};

  letters.split('').forEach((letter, index) => {
    scores[letter] = shuffledNumbers[index];
  });

  return scores;
};

// Get a random vowel for the golden vowel
const getRandomVowel = (seed) => {
  const vowels = 'AEIOU';
  const index = seed % vowels.length;
  return vowels[index];
};

// Main Game Component
const Game = () => {
  const dailySeed = generateDailySeed();
  const todayDate = new Date().toISOString().slice(0, 10);

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [cumulativeScores, setCumulativeScores] = useState(() => JSON.parse(localStorage.getItem('cumulativeScores')) || {});
  const [dailyScore, setDailyScore] = useState(() => {
    const storedDailyScore = JSON.parse(localStorage.getItem('dailyScore')) || { date: todayDate, score: 0 };
    return storedDailyScore.date === todayDate ? storedDailyScore.score : 0;
  });

  const [board, setBoard] = useState(() => JSON.parse(localStorage.getItem('board')) || Array(5).fill('').map(() => Array(5).fill('')));
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem('scores')) || []);
  const [totalScore, setTotalScore] = useState(dailyScore);
  const [currentRow, setCurrentRow] = useState(() => JSON.parse(localStorage.getItem('currentRow')) || 0);
  const [currentCol, setCurrentCol] = useState(() => JSON.parse(localStorage.getItem('currentCol')) || 0);
  const [letterScores] = useState(() => generateLetterScores(dailySeed));
  const [goldenVowel] = useState(() => getRandomVowel(dailySeed));
  const [usedLettersByColumn, setUsedLettersByColumn] = useState(() => JSON.parse(localStorage.getItem('usedLettersByColumn')) || Array(5).fill(new Set()));
  const [showModal, setShowModal] = useState(false);

  const wordList = words.split("\n").map((word) => word.trim().toUpperCase());
  const validWords = new Set(wordList);

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('dailyScore', JSON.stringify({ date: todayDate, score: totalScore }));
    localStorage.setItem('currentRow', JSON.stringify(currentRow));
    localStorage.setItem('currentCol', JSON.stringify(currentCol));
    localStorage.setItem('usedLettersByColumn', JSON.stringify(usedLettersByColumn));
    localStorage.setItem('username', username);

    const updatedCumulativeScores = { ...cumulativeScores, [username]: (cumulativeScores[username] || 0) + totalScore };
    localStorage.setItem('cumulativeScores', JSON.stringify(updatedCumulativeScores));
    setCumulativeScores(updatedCumulativeScores);
  }, [board, scores, totalScore, currentRow, currentCol, usedLettersByColumn, username]);

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
        setDailyScore(totalScore + score);
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      } else {
        setShowModal(true);
      }
    }
  };

  const calculateScore = (word) => {
    return word.split('').reduce((sum, letter) => sum + (letterScores[letter] || 0), 0);
  };

  const updateUsedLetters = (word) => {
    const newUsedLettersByColumn = [...usedLettersByColumn];
    word.split('').forEach((letter, colIndex) => {
      if (letter) newUsedLettersByColumn[colIndex].add(letter);
    });
    setUsedLettersByColumn(newUsedLettersByColumn);
  };

  const closeModal = () => setShowModal(false);

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
              onClick={() => handleLetterInput(letter)}
            >
              {letter} <span className="score">{letterScores[letter]}</span>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="app" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row-wrapper">
            <div className="row">
              {row.map((letter, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${rowIndex === currentRow ? 'active' : ''}`}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="score-box">
              {rowIndex < scores.length ? scores[rowIndex] : ''}
            </div>
          </div>
        ))}
        <div className="total-score">Daily Score: {totalScore}</div>
        <div className="cumulative-score">
          Cumulative Score: {cumulativeScores[username] || 0}
        </div>
      </div>

      <div className="keyboard">{renderKeyboard()}</div>
      <div className="sidebar">
        <input
          className="username-input"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="submitbutt"
          onClick={handleSubmit}
          disabled={currentRow >= 5 || currentCol < 5}
        >
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
  );
};

export default Game;

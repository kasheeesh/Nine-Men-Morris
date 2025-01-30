import React, { useState, useEffect } from 'react';
import './lexiquest.css';
import words from '../assets/words.txt?raw';
import Modal from './ModalLexi';

const generateDailySeed = () => {
  const today = new Date().toISOString().slice(0, 10);
  return today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
};

const generateLetterScores = (seed) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const shuffledNumbers = Array.from({ length: 26 }, (_, i) => i + 1).sort(() => Math.random() - seed % 1);
  const scores = {};
  letters.split('').forEach((letter, index) => {
    scores[letter] = shuffledNumbers[index];
  });
  return scores;
};

const getRandomVowel = (seed) => {
  const vowels = 'AEIOU';
  return vowels[seed % vowels.length];
};

const Game = () => {
  const dailySeed = generateDailySeed();
  const todayDate = new Date().toISOString().slice(0, 10);

  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [cumulativeScores, setCumulativeScores] = useState(() => JSON.parse(localStorage.getItem('cumulativeScores')) || {});
  const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem('leaderboard')) || []);
  
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
  const [showModal, setShowModal] = useState(false);

  const wordList = words.split("\n").map((word) => word.trim().toUpperCase());
  const validWords = new Set(wordList);

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('dailyScore', JSON.stringify({ date: todayDate, score: totalScore }));
    localStorage.setItem('currentRow', JSON.stringify(currentRow));
    localStorage.setItem('currentCol', JSON.stringify(currentCol));
    localStorage.setItem('username', username);
    
    const updatedCumulativeScores = { ...cumulativeScores, [username]: (cumulativeScores[username] || 0) + totalScore };
    localStorage.setItem('cumulativeScores', JSON.stringify(updatedCumulativeScores));
    setCumulativeScores(updatedCumulativeScores);

    const newLeaderboard = [...leaderboard, { username, score: totalScore }].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
  }, [board, scores, totalScore, currentRow, currentCol, username]);

  const handleSubmit = () => {
    if (currentCol === 5) {
      const word = board[currentRow].join('');
      if (validWords.has(word)) {
        const score = word.split('').reduce((sum, letter) => sum + (letterScores[letter] || 0), 0);
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

  return (
    <div className="app">
      <div className="grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row-wrapper">
            <div className="row">
              {row.map((letter, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="cell">{letter}</div>
              ))}
            </div>
            <div className="score-box">{rowIndex < scores.length ? scores[rowIndex] : ''}</div>
          </div>
        ))}
        <div className="total-score">Daily Score: {totalScore}</div>
        <div className="cumulative-score">Cumulative Score: {cumulativeScores[username] || 0}</div>
      </div>
      
      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>{entry.username}: {entry.score}</li>
          ))}
        </ul>
      </div>

      <input placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleSubmit} disabled={currentRow >= 5 || currentCol < 5}>Submit Word</button>
      {showModal && <Modal message="Nice try! But that word doesn't exist in our dictionary." onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Game;

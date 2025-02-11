import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameOptions = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choose a Mode for Nine Men Morris</h1>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => navigate('/games/ninemenmorris')}
        >
          Play with Computer
        </button>
        <button
          style={styles.button}
          onClick={() => navigate('/games/ninemenmorris/friends')}
        >
          Play with Friends
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    color: 'white',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#61dafb',
    color: '#282c34',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s',
  },
};

export default GameOptions;

import React from 'react';

const GameRedirector = () => {
  const games = [
    { name: 'Nine Men Morris', link: '/ninemenmorris' },
    { name: 'Space Shooter', link: '/spaceshooter' },
    { name: 'LexiQuest', link: '/lexiquest' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Infinity Arcade</h1>
      <p style={styles.description}>Choose a game to play and have fun!</p>
      <div style={styles.buttonContainer}>
        {games.map((game, index) => (
          <button
            key={index}
            style={styles.button}
            onClick={() => window.location.href = game.link}
          >
            {game.name}
          </button>
        ))}
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
    backgroundColor: '#282c34',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
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
  buttonHover: {
    backgroundColor: '#21a1f1',
  },
};

// Handle hover effect dynamically
const buttonHoverStyle = document.createElement('style');
buttonHoverStyle.innerHTML = `
  button:hover {
    background-color: #21a1f1;
    transform: scale(1.05);
  }
`;
document.head.appendChild(buttonHoverStyle);

export default GameRedirector;

import React from 'react';
import gamespg from "../assets/gamespg.mp4";
import { useNavigate } from 'react-router-dom';

const GameRedirector = () => {
  const navigate = useNavigate();

  const games = [
    {
      name: 'Nine Men Morris',
      link: '/games/ninemenmorris/options',
    },
    {
      name: 'Space Shooter',
      link: '/games/spaceshooter',
    },
    {
      name: 'LexiQuest',
      link: '/games/lexiquest',
    },
    {
      name: 'MiniSweeper',
      link: '/games/minisweeper',
    }
  ];

  return (
    <div style={styles.container}>
      <video autoPlay loop muted style={styles.video}>
        <source src={gamespg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Profile icon for dashboard navigation */}
      <div style={styles.profileIconContainer} onClick={() => navigate('/games/dashboard')}>
        <div style={styles.profileIcon}>
          <i className="fas fa-user"></i>
        </div>
        <span style={styles.profileText}>Dashboard</span>
      </div>

      <div style={styles.overlay}>
        <h1 style={styles.heading}>Welcome to the Infinity Arcade</h1>
        <p style={styles.description}>Choose a game to play and have fun!</p>

        <div style={styles.buttonContainer}>
          {games.map((game, index) => (
            <div key={index} style={styles.gameContainer}>
              <button
                style={styles.button}
                onClick={() => navigate(game.link)}
              >
                {game.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
  },
  overlay: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'white',
    textAlign: 'center',
    zIndex: 1,
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
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
  gameContainer: {
    marginBottom: '2rem',
  },
  profileIconContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 10,
    backgroundColor: 'rgba(97, 218, 251, 0.8)',
    padding: '8px 15px',
    borderRadius: '20px',
    transition: 'transform 0.2s, background-color 0.2s',
  },
  profileIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
    color: '#282c34',
    fontSize: '16px',
  },
  profileText: {
    color: '#282c34',
    fontWeight: 'bold',
  }
};

// Add hover styles
const additionalStyles = document.createElement('style');
additionalStyles.innerHTML = `
  button:hover {
    background-color: #21a1f1;
    transform: scale(1.05);
  }
  
  [style*="profileIconContainer"]:hover {
    background-color: #21a1f1;
    transform: scale(1.05);
  }
`;
document.head.appendChild(additionalStyles);

export default GameRedirector;

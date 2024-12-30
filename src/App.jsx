import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NineMensMorris from './components/NineMenMorris'
import Lexi from './components/LexiQuest'
import { Game } from './components/Game';
import Games from './components/Games';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/games" element={<Games />} />
        
        <Route path="/games/ninemenmorris" element={<NineMensMorris />} />
        <Route path="/games/lexiquest" element={<Lexi />} />
        <Route path="/games/spaceshooter" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;

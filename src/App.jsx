import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NineMensMorris from './components/NineMenMorris'
import Lexi from './components/LexiQuest'
import { Game } from './components/Game';
import Games from './components/Games';
import LandingPage from './components/LandingPage';
import Signup from './components/SignUp';
import Login from './components/Login';
import MiniSweeper from './components/MiniSweeper';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/games" element={<Games />} />
        
        
        <Route path="/games/ninemenmorris" element={<NineMensMorris />} />
        <Route path="/games/lexiquest" element={<Lexi />} />
        <Route path="/games/spaceshooter" element={<Game />} />
        <Route path='/games/minisweeper' element={<MiniSweeper/>} />
      </Routes>
    </Router>
  );
}

export default App;

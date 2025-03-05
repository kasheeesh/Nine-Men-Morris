import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NineMensMorris from './components/NineMenMorris';
import NineMenMorrisAI from './components/NineMensMorrisAI'; // Import AI version
import PlayWithFriends from './components/PlayWithFriends';
import Lexi from './components/LexiQuest';
import { Game } from './components/Game';
import Games from './components/Games';
import LandingPage from './components/LandingPage';
import Signup from './components/SignUp';
import Login from './components/Login';
import GameOptions from './components/GameOptions';
import MiniSweeper from './components/MiniSweeper';
import Dashboard from './components/Dashboard';
import PlayWithComputer from "./components/PlayWithComputer";

import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/games" element={<Games />} />
          <Route path="/games/dashboard" element={<Dashboard />} />
          <Route path="/games/lexiquest" element={<Lexi />} />
          <Route path="/games/spaceshooter" element={<Game />} />
          <Route path="/games/minisweeper" element={<MiniSweeper />} />
        </Route>
        <Route path="/games/ninemenmorris/options" element={<GameOptions />} />
        <Route path="/games/ninemenmorris" element={<NineMensMorris />} />
        <Route path="/games/ninemenmorris/friends" element={<PlayWithFriends />} />
        <Route path="/games/ninemenmorris/computer" element={<PlayWithComputer />} /> 
      </Routes>
    </Router>
  );
}

export default App;

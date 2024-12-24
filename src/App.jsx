import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NineMensMorris from './components/NineMenMorris'
import Lexi from './components/LexiQuest'
import { Game } from './components/Game';
import Games from './components/Games';

// function App() {

//   return (
//     <>
//       {/* <NineMensMorris/> */}
//       {/* <Lexi/> */}
//        <Game />
//     </>
//   )
// }

// export default App
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="/ninemenmorris" element={<NineMensMorris />} />
        <Route path="/lexiquest" element={<Lexi />} />
        <Route path="/spaceshooter" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;

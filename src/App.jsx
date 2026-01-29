import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GameScreen from './components/GameScreen';
import AdminPanel from './components/AdminPanel';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);

  return (
    <Router>
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* CRT Scanline Overlay */}
        <div className="scanlines"></div>
        <div className="vignette"></div>

        <Routes>
          <Route path="/" element={<LandingPage setPlayerName={setPlayerName} />} />
          <Route path="/game" element={<GameScreen playerName={playerName} score={score} setScore={setScore} />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

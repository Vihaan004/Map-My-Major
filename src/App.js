import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import MapPage from './components/MapPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map/:mapId" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;

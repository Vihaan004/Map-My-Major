import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import Home from './components/Home';
import CreateMap from './components/Maps/CreateMap';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/create-map" element={<PrivateRoute><CreateMap /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

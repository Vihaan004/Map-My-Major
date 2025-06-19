import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AuthPage from './AuthPage';
import AuthCallback from './AuthCallback';
import Home from './Home';
import MapPage from './MapPage';
import PrivateRoute from './PrivateRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/map/:mapId" element={
              <PrivateRoute>
                <MapPage />
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
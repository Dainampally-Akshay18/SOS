import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Navbar/>
        {/* Global Light Mode Container */}
        <div className="min-h-screen bg-white text-gray-800">
          {/* Conditional Navbar - Only show on certain routes */}
          <Routes>
            {/* Routes with Navbar */}
            <Route 
              path="/" 
              element={
                <div>
                  <LandingPage />
                </div>
              } 
            />
            
            {/* Routes without Navbar (Login/Signup have their own styling) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Dashboard with potential different navbar */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

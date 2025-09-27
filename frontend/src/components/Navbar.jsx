import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Color animation for WFC
  const colors = [
    'text-white',
    'text-yellow-300',
    'text-pink-300',
    'text-cyan-300',
    'text-green-300',
    'text-orange-300',
    'text-purple-300',
    'text-red-300',
    'text-blue-300'
  ];

  // Check authentication status on mount and route changes
  useEffect(() => {
    // Check if user is logged in (you can replace this with your auth logic)
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userSession = sessionStorage.getItem('userLoggedIn');
      setIsLoggedIn(!!token || !!userSession || location.pathname === '/dashboard');
    };

    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);

    return () => clearInterval(colorInterval);
  }, [colors.length]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Enterprise-Level Dark Blue CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3px) rotate(1deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
            }
            50% { 
              box-shadow: 0 0 30px rgba(96, 165, 250, 0.5);
            }
          }
          
          .animate-float { animation: float 4s ease-in-out infinite; }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
          
          .dark-nav-shadow {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(15, 23, 42, 0.4);
          }
          
          .dark-nav-shadow-scrolled {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(15, 23, 42, 0.5);
          }
          
          .enterprise-gradient {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          }
          
          .enterprise-gradient-scrolled {
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
          }
        `
      }} />

      {/* Premium Dark Blue Enterprise Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'enterprise-gradient-scrolled dark-nav-shadow-scrolled' 
            : 'enterprise-gradient dark-nav-shadow'
        } border-b-2 border-slate-600/50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Enhanced Logo Section - Enterprise Theme */}
            <div className="flex-shrink-0 group">
              <Link 
                to="/" 
                className="flex items-center space-x-3 transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative animate-float">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
                  <img 
                    src="https://res.cloudinary.com/dadapse5k/image/upload/v1758952474/Screenshot_2025-09-27_112144_xzv4sv.png"
                    alt="WFC Logo"
                    className="relative w-8 h-10  object-cover shadow-xl transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 border-2 border-slate-500/50 group-hover:border-blue-400/70"
                  />
                </div>
                <div className="block">
                  <span 
                    className={`text-lg sm:text-xl font-bold ${colors[colorIndex]} drop-shadow-lg transition-colors duration-1000`}
                    style={{ 
                      textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 12px rgba(96, 165, 250, 0.4)',
                      WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                    }}
                  >
                    WFC
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links - Dark Enterprise Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              
            </div>

            {/* Auth Buttons - Dark Enterprise Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                // Show Login & Signup when not logged in
                <>
                  <Link
                    to="/login"
                    className="relative px-6 py-2 bg-slate-700/60 text-white font-semibold rounded-lg border border-slate-600/60 transition-all duration-300 transform hover:scale-105 hover:bg-slate-700/80 hover:shadow-xl hover:border-blue-400/50 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-slate-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Login</span>
                  </Link>
                  
                  <Link
                    to="/signup"
                    className="relative px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/40 group overflow-hidden border border-blue-500"
                  >
                    <div className="absolute inset-0 bg-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </>
              ) : (
                // Show Logout when logged in
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-slate-300 hover:text-white font-medium rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="relative px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg shadow-red-600/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-600/40 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Dark Enterprise */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-200 bg-slate-700/60 border border-slate-600/60 hover:bg-slate-700/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-110"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6 rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Dark Enterprise */}
        {isMenuOpen && (
          <div className="md:hidden enterprise-gradient-scrolled border-t border-slate-600/50 shadow-2xl shadow-black/40">
            
            {/* Mobile Navigation Links */}
            
            
            {/* Mobile Auth Buttons - Dark Enterprise */}
            <div className="pt-4 pb-3 border-t border-slate-600/50">
              <div className="px-2 space-y-3">
                {!isLoggedIn ? (
                  // Mobile Login & Signup
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-semibold text-white bg-slate-700/60 border border-slate-600/60 hover:bg-slate-700/80 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                      style={{ animation: 'slideInFromLeft 0.7s ease-out' }}
                    >
                      Login
                    </Link>
                    
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="relative block w-full text-left px-4 py-3 rounded-lg text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl group overflow-hidden"
                      style={{ animation: 'slideInFromLeft 0.8s ease-out' }}
                    >
                      <div className="absolute inset-0 bg-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">Get Started</span>
                    </Link>
                  </>
                ) : (
                  // Mobile Logout
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
                      style={{ animation: 'slideInFromLeft 0.7s ease-out' }}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-red-600/30"
                      style={{ animation: 'slideInFromLeft 0.8s ease-out' }}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

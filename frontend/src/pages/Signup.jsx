import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    branch: '' 
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Signup attempt:', formData);
    // Handle signup logic here
    // For demo, redirect to login after successful signup
    // navigate('/login');
    
    setIsLoading(false);
  };

  return (
    <>
      {/* Enhanced CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
          .animate-slideInLeft { animation: slideInLeft 0.7s ease-out; }
          .animate-slideInRight { animation: slideInRight 0.7s ease-out; }
          .animate-float { animation: float 4s ease-in-out infinite; }
          
          .glass-morphism {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          
          .navbar-glass {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(25px);
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
          }
          
          .input-glass {
            background: rgba(243, 244, 246, 0.8);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(229, 231, 235, 0.6);
          }
          
          .input-glass:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(147, 51, 234, 0.6);
            box-shadow: 0 0 25px rgba(147, 51, 234, 0.15);
          }
          
          .select-glass {
            background: rgba(243, 244, 246, 0.8);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(229, 231, 235, 0.6);
          }
          
          .select-glass:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(147, 51, 234, 0.6);
            box-shadow: 0 0 25px rgba(147, 51, 234, 0.15);
          }
        `
      }} />

      {/* Full Screen Container */}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
      

        {/* Main Content - Two Panel Layout */}
        <div className="flex-1 flex pt-16">
          
          {/* Left Panel - Cover Photo with FULL IMAGE DISPLAY */}
          <div className={`hidden lg:flex lg:w-1/2 relative bg-white ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
            
            {/* Full Height Image Container - FIXED */}
            <div className="flex flex-col items-center justify-center w-full h-full p-6">
              <div className="w-full max-w-lg h-full flex flex-col justify-center">
                <img 
                  src="https://res.cloudinary.com/dadapse5k/image/upload/v1758961442/Gemini_Generated_Image_phpaq7phpaq7phpa_qdytkv.png"
                  alt="Join Our Community"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover min-h-[500px] max-h-[600px] animate-float"
                />
                
                {/* Text Below Image */}
                <div className="text-center mt-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Join Our Community
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Become part of our growing family of faith. Connect, grow, and make a difference together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Signup Form */}
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
            
            {/* Signup Form Container */}
            <div className="w-full max-w-md">
              
              {/* Mobile Logo (shown only on mobile) */}
              <div className="lg:hidden text-center mb-8 animate-fadeInUp">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <img 
                    src="https://res.cloudinary.com/dadapse5k/image/upload/v1758952474/Screenshot_2025-09-27_112144_xzv4sv.png"
                    alt="SOS Logo"
                    className="w-12 h-12 rounded-lg object-cover shadow-lg animate-float"
                  />
                  <span className="text-2xl font-bold text-gray-800">SOS Church</span>
                </div>
              </div>

              {/* Glassmorphism Signup Card */}
              <div className="glass-morphism rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full opacity-50"></div>
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4 shadow-xl animate-float">
                    <img src="https://res.cloudinary.com/dadapse5k/image/upload/v1758952474/Screenshot_2025-09-27_112144_xzv4sv.png" alt="" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Create your account
                  </h2>
                  <p className="text-gray-600">
                    Join our community and start your journey with us.
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name Field */}
                  <div className="space-y-2" style={{ animationDelay: '0.4s' }}>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 input-glass rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-300 transform ${
                          focusedField === 'name' ? 'scale-105' : 'scale-100'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {focusedField === 'name' && (
                        <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur opacity-40 animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2" style={{ animationDelay: '0.5s' }}>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 input-glass rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-300 transform ${
                          focusedField === 'email' ? 'scale-105' : 'scale-100'
                        }`}
                        placeholder="Enter your email"
                      />
                      {focusedField === 'email' && (
                        <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur opacity-40 animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2" style={{ animationDelay: '0.6s' }}>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 input-glass rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-300 transform ${
                          focusedField === 'password' ? 'scale-105' : 'scale-100'
                        }`}
                        placeholder="Create a password"
                      />
                      {focusedField === 'password' && (
                        <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur opacity-40 animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Branch Selection Field */}
                  <div className="space-y-2" style={{ animationDelay: '0.7s' }}>
                    <label htmlFor="branch" className="block text-sm font-semibold text-gray-700">
                      Select Branch
                    </label>
                    <div className="relative">
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('branch')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 select-glass rounded-xl text-gray-800 focus:outline-none focus:ring-0 transition-all duration-300 transform ${
                          focusedField === 'branch' ? 'scale-105' : 'scale-100'
                        } appearance-none cursor-pointer`}
                      >
                        <option value="">Choose your branch</option>
                        <option value="branch1">Branch 1</option>
                        <option value="branch2">Branch 2</option>
                      </select>
                      {/* Custom Select Arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {focusedField === 'branch' && (
                        <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur opacity-40 animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start" style={{ animationDelay: '0.8s' }}>
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="w-4 h-4 text-purple-600 bg-white/70 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-purple-600 hover:text-purple-700 underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group overflow-hidden"
                    style={{ animationDelay: '0.9s' }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Button Content */}
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </span>
                  </button>

                  {/* Login Link */}
                  <div className="text-center" style={{ animationDelay: '1s' }}>
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

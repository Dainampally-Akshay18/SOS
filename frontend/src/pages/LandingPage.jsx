import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const programs = [
    {
      title: "MYM - Meet Your Maker",
      image: "https://res.cloudinary.com/dadapse5k/image/upload/v1743651046/x1w1fapozef5oivp3rn4.jpg",
      description: "Empowering young hearts with faith, fellowship, and purpose."
    },
    {
      title: "All Night Prayer",
      image: "https://res.cloudinary.com/dadapse5k/image/upload/v1743651045/ljagatubhzlihceenen9.jpg",
      description: "Deepening our connection with God through dedicated prayer sessions."
    },
    {
      title: "Home Cell Groups",
      image: "https://res.cloudinary.com/dadapse5k/image/upload/v1743651045/mnykuerbjo2kotizm4eb.jpg",
      description: "Intimate fellowship and spiritual growth in comfortable home settings."
    },
    {
      title: "Bible Study",
      image: "https://res.cloudinary.com/dadapse5k/image/upload/v1743651045/xabizqarrcu46xn8knyo.jpg",
      description: "Dive deeper into God's Word with structured study and discussion."
    },
    {
      title: "Sunday School",
      image: "https://res.cloudinary.com/dadapse5k/image/upload/v1743649700/sp4x8mglpiaz9zjfvpgn.jpg",
      description: "Foundation building for all ages in Christian education."
    },
    {
      title: "Youth Meeting",
      image: "https://res.cloudinary.com/dadapse5k/image/upload/v1743645258/yhyiew7qpurzcypaoggc.jpg",
      description: "Dynamic gatherings fostering spiritual growth in young adults."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Header */}
      

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600">
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
                World For Christ Christian Congregation
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-4 font-light">
              A warm, welcoming community where faith and fellowship unite
            </p>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience transformative worship, authentic community, and life-changing encounters with God's love
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/login" 
                className="group bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-2"
              >
                <span>Join Our Community</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a 
                href="#about" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transform hover:-translate-y-2 transition-all duration-300"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Our Heart & Mission
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-light">
              At WFC, we strive to be a beacon of hope and love, empowering everyone to walk in faith and transform lives. 
              Join us in the journey of spiritual growth and community impact as we discover God's incredible plan for each of our lives.
            </p>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              What to Expect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-4 transition-all duration-500 border border-blue-100">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎵</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contemporary Worship</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience heartfelt worship with contemporary Christian music that lifts your spirit and draws you closer to God.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-4 transition-all duration-500 border border-purple-100">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">👔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Come As You Are</h3>
              <p className="text-gray-600 leading-relaxed">
                No dress code required! Whether casual or formal, what matters most is your heart's posture toward God.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-pink-500/20 transform hover:-translate-y-4 transition-all duration-500 border border-pink-100">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Family Friendly</h3>
              <p className="text-gray-600 leading-relaxed">
                Children's programs, youth ministries, and family activities designed to nurture faith at every age.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times & Location */}
      <section id="location" className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Service Times & Location
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-yellow-400 mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Service Info */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                <h3 className="text-3xl font-bold mb-4 text-pink-300">Sunday Morning Service</h3>
                <div className="flex flex-col space-y-2">
                  <span className="text-5xl font-black">7:00 AM</span>
                  <span className="text-xl opacity-90">Every Sunday</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                <h3 className="text-3xl font-bold mb-4 text-pink-300">Our Location</h3>
                <p className="text-xl leading-relaxed">
                  Neredmet X Road<br />
                  Opposite Sunflower Hospital<br />
                  Hyderabad, Telangana
                </p>
              </div>
              
              <button className="group bg-gradient-to-r from-pink-500 to-red-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Directions
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl border border-white/20 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-2">Interactive Map Coming Soon</h3>
              <p className="opacity-80">Neredmet X Road, Opposite Sunflower Hospital</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Our Programs & Ministries
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover opportunities to grow in faith and connect with our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-6 transition-all duration-500 border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 transform scale-90 group-hover:scale-100">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl sm:text-2xl mb-8 opacity-90 font-light">
            Join our loving community and experience the transformative power of faith, fellowship, and God's love.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/login" 
              className="group bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-white/30 transform hover:-translate-y-2 transition-all duration-300 flex items-center gap-2"
            >
              <span>Join Our Community Today</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a 
              href="#location" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transform hover:-translate-y-2 transition-all duration-300"
            >
              Plan Your Visit
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                WFC
              </h3>
              <p className="text-gray-300 font-medium">World For Christ </p>
              <p className="text-gray-400 leading-relaxed">
                Building lives, strengthening faith, transforming communities.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-blue-300">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-300">About</a></li>
                <li><a href="#programs" className="text-gray-400 hover:text-white transition-colors duration-300">Programs</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300">Member Portal</Link></li>
              </ul>
            </div>
            
            {/* Service Times */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-blue-300">Service Times</h4>
              <div className="text-gray-400 space-y-2">
                <p className="font-semibold text-white">Sunday Morning: 7:00 AM</p>
                <p>Neredmet X Road</p>
                <p>Opposite Sunflower Hospital</p>
              </div>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-blue-300">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-pink-600 hover:bg-pink-700 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 World for Christ Christian Congregation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {scrollY > 400 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default LandingPage;

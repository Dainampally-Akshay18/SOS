import React, { useState, useEffect } from 'react';
import { 
  User, 
  Activity, 
  Settings, 
  ChevronRight, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Clock,
  Star,
  Play,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import bibleReadingPlan from '../biberead.json'; // Adjust path as needed

const Home = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentReading, setCurrentReading] = useState(null);

  // Get today's Bible reading
  useEffect(() => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Find today's reading in the Bible plan
    const todayReading = bibleReadingPlan.readingplan?.find(
      reading => reading.date === dateString
    );
    
    setCurrentReading(todayReading);
  }, []);

  const stats = [
    {
      title: 'Total Members',
      value: '1,234',
      icon: User,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Sessions', 
      value: '89',
      icon: Activity,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+0.1%'
    }
  ];

  const recentActivities = [
    {
      type: 'user',
      message: 'Added an new Event',
      time: '2 hours ago',
      color: 'bg-green-500'
    },
    {
      type: 'system',
      message: 'System backup completed successfully',
      time: '4 hours ago',
      color: 'bg-blue-500'
    },
    {
      type: 'prayer',
      message: 'New prayer request submitted',
      time: '6 hours ago',
      color: 'bg-purple-500'
    },
    {
      type: 'sermon',
      message: 'Watched sermon "Faith in Action"',
      time: '1 day ago',
      color: 'bg-orange-500'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Cover Photo and Bible Reading */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Side - Cover Photo */}
        <div className="xl:col-span-2">
          <div className="relative h-96 xl:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src="https://res.cloudinary.com/dadapse5k/image/upload/v1758990986/Gemini_Generated_Image_4fjw3j4fjw3j4fjw_ojm5ya.png"
              alt="Church Ministry Cover"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
                e.target.innerHTML = '<div class="text-white text-2xl font-bold">Church Ministry</div>';
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  Featured Ministry
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome to WFC</h2>
              <p className="text-lg text-gray-200 mb-4">
                Building Faith • Growing Community • Serving Together
              </p>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-300 group">
                <Play className="w-4 h-4" />
                <span className="font-medium">Explore Ministry</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Today's Bible Reading Plan */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-96 xl:h-[500px] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Today's Reading</h3>
                    <p className="text-indigo-100">Daily Bible Study Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-indigo-100 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {currentReading ? formatDate(currentReading.date) : formatDate(new Date().toISOString().split('T')[0])}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">15-20 min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Content */}
            <div className="p-6 h-full overflow-y-auto">
              {currentReading ? (
                <div className="space-y-6">
                  {/* Scripture Sections */}
                  {currentReading.chapters.split(', ').map((chapter, index) => {
                    const sections = [
                      { name: 'New Testament', color: 'bg-blue-500', icon: '📘' },
                      { name: 'Acts/Letters', color: 'bg-green-500', icon: '📜' },
                      { name: 'Psalms', color: 'bg-purple-500', icon: '🎵' },
                      { name: 'Old Testament', color: 'bg-orange-500', icon: '📚' }
                    ];
                    
                    const section = sections[index] || sections[0];
                    const sectionKey = `section-${index}`;
                    const isExpanded = expandedSection === sectionKey;
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}>
                              {section.icon}
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-800">{section.name}</h4>
                              <p className="text-sm text-gray-600">{chapter}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                            {isExpanded ? 
                              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-gray-600">Today's Reading</span>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
                                  📖 Read
                                </button>
                                <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors">
                                  🎧 Listen
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              Continue your spiritual journey with {chapter}. Take time to reflect on God's word and how it applies to your daily life.
                            </p>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 italic">
                                "Your word is a lamp for my feet, a light on my path." - Psalm 119:105
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Progress Indicator */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                      <span className="text-sm text-blue-600">Day 271 of 365</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '74%'}}></div>
                    </div>
                    <p className="text-xs text-gray-600">Keep up the great work! You're 74% through this year's reading plan.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No Reading Plan Available</h4>
                    <p className="text-gray-500">Start your spiritual journey with our daily Bible reading plan.</p>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Browse Reading Plans
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions - Enhanced */}
        

        {/* Recent Activity - Enhanced */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-green-600" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-gray-100">
                  <div className={`w-4 h-4 ${activity.color} rounded-full shadow-sm group-hover:scale-125 transition-transform duration-200`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium group-hover:text-gray-900">{activity.message}</p>
                  </div>
                  <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

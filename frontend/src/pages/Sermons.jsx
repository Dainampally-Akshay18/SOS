import React from 'react';
import { Play, Download, Calendar, Clock, Search, Filter, Mic } from 'lucide-react';

const Sermons = () => {
  const sermons = [
    {
      id: 1,
      title: "The Power of Prayer",
      pastor: "Pastor John Smith",
      date: "September 24, 2025",
      duration: "45 min",
      series: "Spiritual Foundations",
      thumbnail: "/api/placeholder/300/200",
      audioUrl: "#",
      videoUrl: "#"
    },
    {
      id: 2,
      title: "Living with Purpose",
      pastor: "Pastor Sarah Johnson",
      date: "September 17, 2025",
      duration: "52 min",
      series: "Life Transformation",
      thumbnail: "/api/placeholder/300/200",
      audioUrl: "#",
      videoUrl: "#"
    },
    {
      id: 3,
      title: "God's Grace in Action",
      pastor: "Pastor Michael Brown",
      date: "September 10, 2025",
      duration: "38 min",
      series: "Amazing Grace",
      thumbnail: "/api/placeholder/300/200",
      audioUrl: "#",
      videoUrl: "#"
    }
  ];

  const series = ["All Series", "Spiritual Foundations", "Life Transformation", "Amazing Grace"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Mic className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Sermons</h1>
        <p className="text-blue-100 text-lg">
          Listen to powerful sermons and messages from our services.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sermons..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {series.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Upload Sermon
            </button>
          </div>
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.map(sermon => (
          <div key={sermon.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <Play className="w-6 h-6 text-blue-600 ml-1" />
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {sermon.duration}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Series Badge */}
              <div className="mb-3">
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {sermon.series}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {sermon.title}
              </h3>
              
              {/* Pastor */}
              <p className="text-gray-600 mb-3">{sermon.pastor}</p>
              
              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{sermon.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{sermon.duration}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Sermons</h3>
          <p className="text-gray-600 mb-4">Access the latest messages from our Sunday services.</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Audio Library</h3>
          <p className="text-gray-600 mb-4">Browse our complete collection of sermon recordings.</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Browse Audio →
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Video Messages</h3>
          <p className="text-gray-600 mb-4">Watch video recordings of services and events.</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Watch Videos →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sermons;

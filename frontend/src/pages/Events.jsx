import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, Eye } from 'lucide-react';

const Events = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'

  const events = [
    {
      id: 1,
      title: "Sunday Morning Worship",
      date: "September 29, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Main Sanctuary",
      attendees: 250,
      type: "Worship Service",
      status: "Upcoming",
      description: "Join us for our weekly worship service with inspiring music and powerful preaching.",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Youth Bible Study",
      date: "October 2, 2025",
      time: "7:00 PM - 8:30 PM",
      location: "Youth Room",
      attendees: 45,
      type: "Bible Study",
      status: "Upcoming",
      description: "Weekly Bible study for teenagers focusing on practical Christian living.",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Community Outreach Program",
      date: "October 5, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "City Center",
      attendees: 80,
      type: "Outreach",
      status: "Planning",
      description: "Reaching out to our community with food distribution and prayer services.",
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Marriage Enrichment Seminar",
      date: "October 12, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Fellowship Hall",
      attendees: 30,
      type: "Seminar",
      status: "Registration Open",
      description: "Strengthen your marriage with biblical principles and practical advice.",
      color: "bg-pink-500"
    }
  ];

  const eventTypes = ["All Types", "Worship Service", "Bible Study", "Outreach", "Seminar", "Conference"];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Registration Open': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-blue-100 text-lg">
          Stay updated with upcoming church events and activities.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* View Mode and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Calendar
              </button>
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header with color bar */}
              <div className={`h-2 ${event.color}`}></div>
              
              <div className="p-6">
                {/* Status and Type */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {event.type}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {event.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {event.description}
                </p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} expected</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Register
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Calendar View</h3>
            <p className="text-gray-500">Calendar integration coming soon...</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{events.length}</p>
              <p className="text-gray-600 text-sm">Total Events</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {events.reduce((sum, event) => sum + event.attendees, 0)}
              </p>
              <p className="text-gray-600 text-sm">Total Attendees</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {events.filter(e => e.status === 'Upcoming').length}
              </p>
              <p className="text-gray-600 text-sm">Upcoming</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {[...new Set(events.map(e => e.location))].length}
              </p>
              <p className="text-gray-600 text-sm">Venues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;

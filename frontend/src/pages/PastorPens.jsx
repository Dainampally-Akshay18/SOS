import React from 'react';
import { BookOpen, Calendar, User, Search, Filter } from 'lucide-react';

const PastorPens = () => {
  const articles = [
    {
      id: 1,
      title: "Walking in Faith: A Journey of Trust",
      author: "Pastor John Smith",
      date: "September 25, 2025",
      excerpt: "In times of uncertainty, our faith becomes the anchor that keeps us grounded. Learn how to strengthen your walk with God...",
      readTime: "5 min read",
      category: "Faith"
    },
    {
      id: 2,
      title: "The Power of Community in Christian Life",
      author: "Pastor Sarah Johnson",
      date: "September 22, 2025",
      excerpt: "God has called us to live in community. Discover the importance of fellowship and how it transforms our spiritual journey...",
      readTime: "7 min read",
      category: "Community"
    },
    {
      id: 3,
      title: "Finding Hope in God's Promises",
      author: "Pastor Michael Brown",
      date: "September 20, 2025",
      excerpt: "When life gets difficult, we can always turn to God's promises for hope and encouragement. Here's how to claim them...",
      readTime: "6 min read",
      category: "Hope"
    }
  ];

  const categories = ["All", "Faith", "Community", "Hope", "Prayer", "Worship"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Pastor Pens</h1>
        <p className="text-blue-100 text-lg">
          Read inspirational messages and teachings from our pastoral team.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              New Article
            </button>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {article.category}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                {article.title}
              </h3>
              
              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
              </div>
              
              {/* Read More */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{article.readTime}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Featured Articles</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Weekly Devotionals</h4>
            <p className="text-gray-600 text-sm">Start your week with inspiring devotionals from our pastoral team.</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Bible Study Guides</h4>
            <p className="text-gray-600 text-sm">Deep dive into scripture with our comprehensive study guides.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastorPens;

import React from 'react';
import { 
  Home, 
  BookOpen, 
  Mic, 
  Calendar, 
  User, 
  X, 
  Church,
  ChevronRight,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeRoute, onNavigate }) => {
  const navigationItems = [
    { name: 'Home', icon: Home, route: '/dashboard/home' },
    { name: 'Pastor Pens', icon: BookOpen, route: '/dashboard/pastorpen' },
    { name: 'Sermons', icon: Mic, route: '/dashboard/sermons' },
    { name: 'Events', icon: Calendar, route: '/dashboard/events' },
    { name: 'Profile', icon: User, route: '/dashboard/profile' },
  ];

  const handleNavigation = (route) => {
    onNavigate(route);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Fixed Sidebar - Full Height from Top to Bottom */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-50 w-72 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        bg-white border-r border-gray-200 shadow-lg
        flex flex-col
      `}>
        {/* Header Section */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WFC</h1>
                <p className="text-sm text-gray-500">Management</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.route;
              
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavigation(item.route)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section - Fixed at Bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">TU</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">Test User</p>
              <p className="text-sm text-gray-500 truncate">Church Member</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

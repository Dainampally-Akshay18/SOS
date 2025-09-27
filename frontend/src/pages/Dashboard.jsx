import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Home from './Home';
import PastorPens from './PastorPens';
import Sermons from './Sermons';
import Events from './Events';
import Profile from './Profile';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/dashboard/home');

  const handleNavigation = (route) => {
    setActiveRoute(route);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeRoute) {
      case '/dashboard/home':
        return <Home />;
      case '/dashboard/pastorpen':
        return <PastorPens />;
      case '/dashboard/sermons':
        return <Sermons />;
      case '/dashboard/events':
        return <Events />;
      case '/dashboard/profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16"> {/* Account for navbar */}
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeRoute={activeRoute}
        onNavigate={handleNavigation}
      />

      {/* Main Content Area - Fixed positioning with proper margin */}
      <div className="lg:ml-72"> {/* Exactly 288px (w-72) margin to match sidebar width */}
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-16 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Page Content - Reduced padding */}
        <main className="p-6"> {/* Reduced from p-4 sm:p-6 lg:p-8 */}
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

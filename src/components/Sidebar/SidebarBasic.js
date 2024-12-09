import React from 'react';
import '../../index.css';


const SidebarBasic = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      {/* Sidebar Header */}
      <div className="text-xl font-bold mb-6">Menu</div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        <a
          href="#dashboard"
          className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </a>
        <a
          href="#profile"
          className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Profile
        </a>
        <a
          href="#settings"
          className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Settings
        </a>
        <a
          href="#help"
          className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Help
        </a>
      </nav>
    </div>
  );
};

export default SidebarBasic; 
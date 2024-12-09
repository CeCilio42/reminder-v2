import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../index.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      section: 'Main',
      items: [
        { id: 'home', name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/home' },
        { id: 'create', name: 'Create', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '/create' },
      ]
    },
    {
      section: 'Management',
      items: [
        { id: 'company', name: 'Company', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', path: '/company' },
        { id: 'calendar', name: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/calendar' },
        { id: 'saved', name: 'Saved', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', path: '/saved' },
      ]
    },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <span className="text-xl font-bold">Reminder</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar Content */}
      <nav className="mt-5 px-2">
        {menuItems.map((menu) => (
          <div key={menu.section} className="mb-4">
            {isOpen && (
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {menu.section}
              </h3>
            )}
            <div className="mt-2 space-y-1">
              {menu.items.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentPath === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <svg
                    className={`${
                      isOpen ? 'mr-3' : 'mx-auto'
                    } h-6 w-6`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {isOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 
import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppStore } from '../../lib/store';

export const Layout = ({ children }) => {
  const { isSidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900/20 to-gray-900">
      {/* Particle background */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : ''}`}>
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, RefreshCw, Wrench, Home, RotateCcw } from 'lucide-react';
import { resetDemoData } from '../api';

export default function Navbar({ currentView, setCurrentView, isTechnicianMode, setIsTechnicianMode, onDataReset }) {
  const handleResetDemo = async () => {
    if (window.confirm('Reset sample demonstration scenario to initial state?')) {
      try {
        await resetDemoData();
        if (onDataReset) onDataReset();
      } catch (err) {
        console.error('Reset error:', err);
      }
    }
  };

  return (
    <header className="h-14 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            FS
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              FixSaathi
            </span>
            <span className="text-[10px] text-zinc-400 block -mt-1 font-mono">
              फिक्स साथी
            </span>
          </div>
        </button>

        {/* Sarvam AI Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50/80 border border-teal-200/60 text-[11px] text-teal-800 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
          <span>Sarvam AI Active</span>
        </div>
      </div>

      {/* Center navigation shortcuts if in app */}
      {currentView !== 'landing' && (
        <div className="hidden sm:flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => {
              setIsTechnicianMode(false);
              setCurrentView('dashboard');
            }}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              !isTechnicianMode ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Household</span>
          </button>
          <button
            onClick={() => {
              setIsTechnicianMode(true);
              setCurrentView('technician');
            }}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              isTechnicianMode ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Technician Portal</span>
          </button>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleResetDemo}
          className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 px-2.5 py-1 rounded-md hover:bg-zinc-100 border border-zinc-200 flex items-center gap-1 transition-colors"
          title="Reset demonstration data"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {currentView === 'landing' ? (
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
          >
            Open Dashboard
          </button>
        ) : (
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium text-xs flex items-center justify-center">
              PS
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

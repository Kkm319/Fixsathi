import React from 'react';
import { 
  LayoutDashboard, 
  Tv, 
  Clock, 
  FileText, 
  Mic, 
  Wrench, 
  Settings,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, isTechnicianMode, setIsTechnicianMode }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'appliances', label: 'My Appliances', icon: Tv },
    { id: 'history', label: 'Repair History', icon: Clock },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'voice', label: 'Voice Assistant', icon: Mic, badge: 'Sarvam AI' },
    { id: 'technician', label: 'Technician View', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 border-r border-zinc-200/80 bg-white flex flex-col shrink-0 min-h-[calc(100vh-3.5rem)] select-none">
      <div className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'technician') {
                  setIsTechnicianMode(true);
                } else {
                  setIsTechnicianMode(false);
                }
                setCurrentView(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-teal-50/80 text-teal-800 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle household profile footer */}
      <div className="p-3 border-t border-zinc-100 bg-zinc-50/60">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-medium shrink-0">
            P
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-zinc-850 truncate">Parul Sharma</p>
            <p className="text-[10px] text-zinc-400 truncate">Household Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

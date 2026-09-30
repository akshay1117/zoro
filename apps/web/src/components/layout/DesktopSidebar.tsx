import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity, DollarSign, Target, Briefcase, BookOpen, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Habits', path: '/habits', icon: Activity },
  { name: 'Expenses', path: '/expenses', icon: DollarSign },
  { name: 'Fitness', path: '/fitness', icon: Target },
  { name: 'Trading', path: '/trading', icon: Briefcase },
  { name: 'Cybersecurity', path: '/cyber', icon: Shield },
  { name: 'Notes', path: '/notes', icon: BookOpen },
];

export const DesktopSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r border-[#24242A] bg-[#0F0F12] p-4 fixed left-0 top-0 z-20">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-8 h-8 rounded-full border border-[#8B5CF6] flex items-center justify-center bg-[#08080A]">
          <span className="font-display font-bold text-[#F5F5F7] text-xs">Z</span>
        </div>
        <span className="font-display font-bold tracking-widest text-[#F5F5F7]">ZORO</span>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ease-out-cubic ${
                  isActive
                    ? 'bg-[#151519] text-[#8B5CF6] border border-[#24242A]'
                    : 'text-[#94949E] hover:bg-[#151519] hover:text-[#D1D1D6] border border-transparent'
                }`
              }
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="mt-auto px-2 pt-4 border-t border-[#24242A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1C1C22] flex items-center justify-center border border-[#24242A]">
            <span className="text-xs font-semibold text-[#D1D1D6]">AK</span>
          </div>
          <div>
            <div className="text-sm font-medium text-[#F5F5F7]">Akshay</div>
            <div className="text-xs text-[#94949E]">System Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

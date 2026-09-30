import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity, DollarSign, Target } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Habits', path: '/habits', icon: Activity },
  { name: 'Expenses', path: '/expenses', icon: DollarSign },
  { name: 'Fitness', path: '/fitness', icon: Target },
];

export const MobileBottomNav: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0F0F12]/80 backdrop-blur-md border-t border-[#24242A] z-40 flex justify-around items-center px-2 pb-safe-area-inset-bottom">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors duration-150 ${
                isActive ? 'text-[#8B5CF6]' : 'text-[#94949E] hover:text-[#D1D1D6]'
              }`
            }
          >
            <Icon size={20} className="mb-1" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

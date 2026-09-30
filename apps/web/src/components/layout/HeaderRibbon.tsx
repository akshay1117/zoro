import React, { useState } from 'react';
import { Bell, Search, Mic } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../store/useAuthStore';
import { NotificationCenterDrawer } from './NotificationCenterDrawer';

export const HeaderRibbon: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  let title = 'Dashboard';
  
  if (path === '/tasks') title = 'Tasks';
  else if (path === '/habits') title = 'Habits';
  else if (path === '/expenses') title = 'Expenses';
  else if (path === '/fitness') title = 'Fitness';
  else if (path === '/trading') title = 'Trading';
  else if (path === '/cyber') title = 'Cybersecurity';
  else if (path === '/notes') title = 'Notes';
  else if (path === '/goals') title = 'Goals & OKRs';

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { data: unreadData } = useQuery({
    queryKey: ['notifications_unread'],
    queryFn: async () => {
      const res = await api.get('/notifications/unread-count');
      return res.data;
    },
    refetchInterval: 30000 // Poll every 30s
  });

  const unreadCount = unreadData?.unread_count || 0;

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#08080A]/80 backdrop-blur-md border-b border-[#24242A] flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center lg:hidden gap-3">
        <div className="w-8 h-8 rounded-full border border-[#8B5CF6] flex items-center justify-center bg-[#08080A]">
          <span className="font-display font-bold text-[#F5F5F7] text-xs">Z</span>
        </div>
      </div>
      
      <div className="hidden lg:flex items-center text-sm text-[#94949E] flex-1">
        <span className="font-medium text-[#D1D1D6]">ZORO</span>
        <span className="mx-2 text-[#3A3A44]">/</span>
        <span className="capitalize">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Command Bar */}
        <div 
          onClick={() => document.dispatchEvent(new CustomEvent('open-zoro-command'))}
          className="hidden md:flex items-center bg-[#0F0F12] border border-[#24242A] rounded-full px-3 py-1.5 h-9 w-64 cursor-text hover:border-violet-500/50 transition-colors"
        >
          <Search size={14} className="text-[#94949E] mr-2" />
          <div className="text-sm text-[#94949E] flex-1">Command Zoro... (Cmd+K)</div>
          <Mic size={14} className="text-[#94949E] ml-2 cursor-pointer hover:text-[#8B5CF6] transition-colors" />
        </div>

        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative p-2 text-[#94949E] hover:text-[#F5F5F7] transition-colors rounded-full hover:bg-[#151519]"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8B5CF6] rounded-full ring-2 ring-[#08080A]"></span>
          )}
        </button>
        
        <NotificationCenterDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      </div>
    </header>
  );
};

import React from 'react';
import { Bell, Search, Mic } from 'lucide-react';

export const HeaderRibbon: React.FC = () => {
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
        <span>Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Command Bar Placeholder */}
        <div className="hidden md:flex items-center bg-[#0F0F12] border border-[#24242A] rounded-full px-3 py-1.5 h-9 w-64">
          <Search size={14} className="text-[#94949E] mr-2" />
          <input 
            type="text" 
            placeholder="Command Zoro... (Cmd+K)" 
            className="bg-transparent border-none outline-none text-sm text-[#F5F5F7] placeholder:text-[#94949E] w-full"
          />
          <Mic size={14} className="text-[#94949E] ml-2 cursor-pointer hover:text-[#8B5CF6] transition-colors" />
        </div>

        <button className="relative p-2 text-[#94949E] hover:text-[#F5F5F7] transition-colors rounded-full hover:bg-[#151519]">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8B5CF6] rounded-full ring-2 ring-[#08080A]"></span>
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Terminal, Flag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../store/useAuthStore';
import { CyberSessionDrawer } from '../components/modules/cyber/CyberSessionDrawer';

export const CyberPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['cyberSessions'],
    queryFn: async () => {
      const res = await api.get(`/cyber/sessions`);
      return res.data;
    }
  });

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Cybersecurity</h1>
          <p className="text-gray-400 text-sm mt-1">Offensive Security & Research Logs.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-6">
        
        {/* Sessions Log */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Terminal size={14} /> Training Operations
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              [1, 2].map(i => <div key={i} className="h-32 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />)
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 bg-[#141419] border border-white/5 rounded-2xl">
                <Terminal size={32} className="text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">No operations logged.</p>
              </div>
            ) : (
              sessions.map((session: any) => (
                <div key={session.id} className="p-5 bg-[#141419] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-lg">{session.session_title}</h4>
                      <span className="text-xs font-medium text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded uppercase border border-violet-400/20">
                        {session.platform}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {format(new Date(session.created_at), 'MMM d')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-4 mb-3 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-500" />
                      <span>{session.duration_minutes}m</span>
                    </div>
                    {session.flags_captured > 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Flag size={14} />
                        <span>{session.flags_captured} Flags</span>
                      </div>
                    )}
                  </div>

                  {session.notes_markdown && (
                    <div className="mt-3 p-3 bg-black/40 rounded-lg text-sm text-gray-400 font-mono line-clamp-3">
                      {session.notes_markdown}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-900/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      <CyberSessionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

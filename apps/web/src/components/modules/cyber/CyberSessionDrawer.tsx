import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface CyberSessionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CyberSessionDrawer: React.FC<CyberSessionDrawerProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('HTB');
  const [duration, setDuration] = useState('60');
  const [flags, setFlags] = useState('0');
  const [notes, setNotes] = useState('');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newSession: any) => {
      const response = await api.post('/cyber/sessions', newSession);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cyberSessions'] });
      setTitle('');
      setPlatform('HTB');
      setDuration('60');
      setFlags('0');
      setNotes('');
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !platform || !duration) return;
    
    createMutation.mutate({
      session_title: title,
      platform,
      duration_minutes: parseInt(duration),
      flags_captured: parseInt(flags),
      notes_markdown: notes || null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] md:h-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl bg-[#0f0f13] border-t md:border border-white/10 z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-light text-white">Log Cyber Session</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Session Title / Machine Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. HTB: Lame"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="HTB">HackTheBox</option>
                    <option value="THM">TryHackMe</option>
                    <option value="PORT_SWIGGER">PortSwigger</option>
                    <option value="VULNHUB">VulnHub</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Flags Captured
                </label>
                <input
                  type="number"
                  min="0"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Notes (Markdown)
                </label>
                <textarea
                  placeholder="Vulnerabilities found, exploits used..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 min-h-[120px] resize-none transition-colors font-mono"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !title || !duration}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg transition-colors"
                >
                  {createMutation.isPending ? 'Logging...' : 'Save Session'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

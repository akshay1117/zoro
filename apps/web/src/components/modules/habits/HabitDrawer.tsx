import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface HabitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HabitDrawer: React.FC<HabitDrawerProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDays, setTargetDays] = useState(7);
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newHabit: any) => {
      const response = await api.post('/habits', newHabit);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      setName('');
      setDescription('');
      setTargetDays(7);
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    createMutation.mutate({
      name,
      description: description || null,
      target_days_per_week: targetDays,
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f0f13] border-l border-white/10 z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-light text-white">New Habit</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Habit Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Why are you building this habit?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 min-h-[100px] resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Target Days Per Week
                </label>
                <div className="flex items-center justify-between bg-[#141419] border border-white/10 rounded-xl p-3">
                  <span className="text-white font-medium">{targetDays} days</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="7" 
                    value={targetDays} 
                    onChange={(e) => setTargetDays(parseInt(e.target.value))}
                    className="w-1/2 accent-violet-500"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !name.trim()}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg transition-colors"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface WorkoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORKOUT_TYPES = ['PPL_PUSH', 'PPL_PULL', 'PPL_LEGS', 'UPPER_BODY', 'LOWER_BODY', 'FULL_BODY', 'CARDIO', 'REST'];

export const WorkoutDrawer: React.FC<WorkoutDrawerProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState('PPL_PUSH');
  const [duration, setDuration] = useState('60');
  const [intensity, setIntensity] = useState('HIGH');
  const [notes, setNotes] = useState('');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newWorkout: any) => {
      const response = await api.post('/workouts', newWorkout);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      setType('PPL_PUSH');
      setDuration('60');
      setIntensity('HIGH');
      setNotes('');
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createMutation.mutate({
      type,
      duration_minutes: duration ? parseInt(duration) : null,
      intensity,
      notes: notes || null,
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
              <h2 className="text-xl font-display font-light text-white">Log Workout</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Workout Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  {WORKOUT_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Intensity
                  </label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MAX">MAX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="How did it feel? PRs?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 min-h-[100px] resize-none transition-colors"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg transition-colors"
                >
                  {createMutation.isPending ? 'Logging...' : 'Log Workout'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

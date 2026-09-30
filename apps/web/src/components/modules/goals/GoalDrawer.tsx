import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Target } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface GoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: any;
}

export const GoalDrawer: React.FC<GoalDrawerProps> = ({ isOpen, onClose, goal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ACADEMIC');
  const [timeframe, setTimeframe] = useState('MONTHLY');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  
  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || '');
      setCategory(goal.category);
      setTimeframe(goal.timeframe);
      setTargetValue(goal.target_value ? goal.target_value.toString() : '');
      setUnit(goal.unit || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('ACADEMIC');
      setTimeframe('MONTHLY');
      setTargetValue('');
      setUnit('');
    }
  }, [goal, isOpen]);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (goal) {
        const response = await api.patch(`/goals/${goal.id}`, data);
        return response.data;
      } else {
        const response = await api.post('/goals', data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (goal) {
        await api.delete(`/goals/${goal.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      onClose();
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) return;
    
    saveMutation.mutate({
      title,
      description: description || null,
      category,
      timeframe,
      target_value: targetValue ? parseFloat(targetValue) : null,
      unit: unit || null
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
              <h2 className="text-xl font-display font-light text-white flex items-center gap-2">
                <Target size={20} className="text-violet-500" />
                {goal ? 'Edit Goal' : 'Define Goal'}
              </h2>
              <div className="flex items-center gap-2">
                {goal && (
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this goal?")) {
                        deleteMutation.mutate();
                      }
                    }}
                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Achieve 3.8 GPA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="FINANCE">Finance</option>
                    <option value="CYBER">Cybersecurity</option>
                    <option value="PERSONAL">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="SEMESTER">Semester</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Target Value (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.8"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Unit (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GPA, lbs, $..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Description / Strategy
                </label>
                <textarea
                  placeholder="How will you achieve this?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 min-h-[100px] resize-none transition-colors"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saveMutation.isPending || !title}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {saveMutation.isPending ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

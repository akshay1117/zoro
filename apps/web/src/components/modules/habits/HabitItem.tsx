import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface HabitItemProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    current_streak: number;
    longest_streak: number;
    completed_today: boolean;
  };
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit }) => {
  const queryClient = useQueryClient();

  const logMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/habits/${id}/log`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });

  return (
    <div className={`p-5 rounded-xl border transition-all ${
      habit.completed_today 
        ? 'bg-emerald-500/10 border-emerald-500/20' 
        : 'bg-[#141419] border-white/5 hover:border-white/10'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-medium ${habit.completed_today ? 'text-emerald-400' : 'text-white'}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{habit.description}</p>
          )}
          
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full font-medium">
              <Flame size={14} className={habit.current_streak > 0 ? "fill-orange-400" : ""} />
              <span>{habit.current_streak} Day Streak</span>
            </div>
            <span className="text-xs text-gray-500">
              Best: {habit.longest_streak}
            </span>
          </div>
        </div>

        <button
          onClick={() => !habit.completed_today && logMutation.mutate(habit.id)}
          disabled={habit.completed_today || logMutation.isPending}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            habit.completed_today
              ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
              : 'bg-white/5 hover:bg-violet-500/20 hover:text-violet-400 text-gray-400'
          }`}
        >
          {habit.completed_today ? <Check size={24} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
        </button>
      </div>
    </div>
  );
};

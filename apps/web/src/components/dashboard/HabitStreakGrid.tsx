import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Check } from 'lucide-react';

interface HabitStreakGridProps {
  completedToday: number;
  isLoading: boolean;
}

export const HabitStreakGrid: React.FC<HabitStreakGridProps> = ({ completedToday, isLoading }) => {
  if (isLoading) {
    return <div className="h-40 rounded-xl bg-surface/50 border border-white/5 animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface border border-white/5 rounded-xl p-5 hover:border-orange-500/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
          <Flame size={14} className="text-orange-500" />
          Daily Habits
        </h3>
      </div>
      
      <div className="flex flex-col h-[calc(100%-2rem)] justify-center">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-display font-light text-white">
            {completedToday}
          </span>
          <span className="text-gray-500 text-sm">completed today</span>
        </div>

        {/* Visual grid representation */}
        <div className="flex gap-2 mt-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`h-8 flex-1 rounded-md flex items-center justify-center transition-colors ${
                i < Math.min(completedToday, 5) 
                  ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {i < Math.min(completedToday, 5) && <Check size={14} />}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

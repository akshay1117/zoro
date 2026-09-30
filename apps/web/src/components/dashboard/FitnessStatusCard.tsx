import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Dumbbell, AlertTriangle } from 'lucide-react';

interface FitnessStatusCardProps {
  workoutCompletedToday: boolean;
  isLoading: boolean;
}

export const FitnessStatusCard: React.FC<FitnessStatusCardProps> = ({ workoutCompletedToday, isLoading }) => {
  if (isLoading) {
    return <div className="h-40 rounded-xl bg-surface/50 border border-white/5 animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-surface border rounded-xl p-5 transition-colors ${
        workoutCompletedToday 
          ? 'border-emerald-500/20 hover:border-emerald-500/40' 
          : 'border-white/5 hover:border-blue-500/30'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
          <Activity size={14} className={workoutCompletedToday ? 'text-emerald-500' : 'text-blue-500'} />
          Fitness
        </h3>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] mt-2">
        {workoutCompletedToday ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <Dumbbell className="text-emerald-400" size={24} />
            </div>
            <span className="text-emerald-400 text-sm font-medium">Session Completed</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <AlertTriangle className="text-gray-400" size={24} />
            </div>
            <span className="text-gray-400 text-sm">No workout logged yet</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

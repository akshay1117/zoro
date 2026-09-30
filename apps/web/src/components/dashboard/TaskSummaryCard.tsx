import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, CalendarClock } from 'lucide-react';

interface TaskSummaryCardProps {
  incompleteCount: number;
  urgentDeadline?: string;
  isLoading: boolean;
}

export const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ incompleteCount, urgentDeadline, isLoading }) => {
  if (isLoading) {
    return <div className="h-40 rounded-xl bg-surface/50 border border-white/5 animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-white/5 rounded-xl p-5 hover:border-violet-500/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={14} className="text-violet-500" />
          Active Tasks
        </h3>
      </div>
      
      <div className="mb-4">
        <span className="text-4xl font-display font-light text-white">
          {incompleteCount}
        </span>
        <span className="text-gray-500 text-sm ml-2">pending</span>
      </div>

      {urgentDeadline ? (
        <div className="flex items-start gap-2 text-sm text-red-400 bg-red-400/10 p-2.5 rounded-lg border border-red-400/20">
          <Clock size={14} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{urgentDeadline}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 p-2.5 rounded-lg border border-emerald-400/20">
          <CalendarClock size={14} />
          <span>No urgent deadlines</span>
        </div>
      )}
    </motion.div>
  );
};

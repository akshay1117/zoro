import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Check, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  tags: string[];
}

interface SwipeableTaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  HIGH: 'text-red-400 border-red-400/20 bg-red-400/10',
  MEDIUM: 'text-orange-400 border-orange-400/20 bg-orange-400/10',
  LOW: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
};

export const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({ task, onComplete, onDelete }) => {
  const controls = useAnimation();
  
  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Swiped right - Complete
      await controls.start({ x: '100%', opacity: 0 });
      onComplete(task.id);
    } else if (offset < -100 || velocity < -500) {
      // Swiped left - Delete
      await controls.start({ x: '-100%', opacity: 0 });
      onDelete(task.id);
    } else {
      // Snap back
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0f0f13] border border-white/5 mb-3">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
        <div className="flex items-center gap-2 text-emerald-500 font-medium">
          <Check size={20} />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-medium">
          <span>Delete</span>
          <Trash2 size={20} />
        </div>
      </div>

      {/* Foreground Draggable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 bg-[#141419] p-4 flex flex-col gap-2 shadow-sm rounded-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h4 className={`text-base font-medium ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-white'}`}>
            {task.title}
          </h4>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2">
          {task.due_date && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} />
              <span>{format(new Date(task.due_date), 'MMM d, h:mm a')}</span>
            </div>
          )}
          
          {task.tags?.length > 0 && (
            <div className="flex items-center gap-2">
              {task.tags.map(tag => (
                <span key={tag} className="text-xs text-violet-400 bg-violet-400/10 px-2 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

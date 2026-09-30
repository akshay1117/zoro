import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { api } from '../store/useAuthStore';
import { SwipeableTaskItem } from '../components/modules/tasks/SwipeableTaskItem';
import { TaskDrawer } from '../components/modules/tasks/TaskDrawer';

export const TasksPage: React.FC = () => {
  const [filter, setFilter] = useState<'TODO' | 'DONE' | 'ALL'>('TODO');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      const statusParam = filter !== 'ALL' ? `?status=${filter}` : '';
      const res = await api.get(`/tasks${statusParam}`);
      return res.data;
    }
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/tasks/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your active directives.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
        {['TODO', 'DONE', 'ALL'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`text-sm font-medium transition-colors ${
              filter === f ? 'text-violet-400 border-b-2 border-violet-500 pb-1 -mb-[17px]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f === 'TODO' ? 'Active' : f === 'DONE' ? 'Completed' : 'All'}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-sm">
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {tasks.map((task: any) => (
              <SwipeableTaskItem
                key={task.id}
                task={task}
                onComplete={(id) => completeMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-900/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      <TaskDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

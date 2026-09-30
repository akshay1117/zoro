import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { api } from '../store/useAuthStore';
import { HabitItem } from '../components/modules/habits/HabitItem';
import { HabitDrawer } from '../components/modules/habits/HabitDrawer';

export const HabitsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const res = await api.get(`/habits`);
      return res.data;
    }
  });

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Habits</h1>
          <p className="text-gray-400 text-sm mt-1">Consistency compounds.</p>
        </div>
      </div>

      {/* Habit List */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-sm">
            <p>No habits tracked yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit: any) => (
              <HabitItem key={habit.id} habit={habit} />
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

      <HabitDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

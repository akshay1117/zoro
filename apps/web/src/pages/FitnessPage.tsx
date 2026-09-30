import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Dumbbell, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../store/useAuthStore';
import { WorkoutDrawer } from '../components/modules/fitness/WorkoutDrawer';

export const FitnessPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const res = await api.get(`/workouts`);
      return res.data;
    }
  });

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Fitness</h1>
          <p className="text-gray-400 text-sm mt-1">Physical engineering.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-6">
        
        {/* Workout History */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={14} /> Training Log
          </h3>
          <div className="space-y-3">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />)
            ) : workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 bg-[#141419] border border-white/5 rounded-2xl">
                <Dumbbell size={32} className="text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">No workouts logged yet.</p>
              </div>
            ) : (
              workouts.map((workout: any) => (
                <div key={workout.id} className="p-4 bg-[#141419] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white tracking-wide">{workout.type.replace('_', ' ')}</h4>
                    <span className="text-xs font-medium text-gray-500">
                      {format(new Date(workout.start_time), 'MMM d')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    {workout.duration_minutes && (
                      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                        <Clock size={12} />
                        <span>{workout.duration_minutes}m</span>
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded ${
                      workout.intensity === 'HIGH' || workout.intensity === 'MAX' 
                        ? 'text-red-400 bg-red-400/10' 
                        : 'text-emerald-400 bg-emerald-400/10'
                    }`}>
                      {workout.intensity} INTENSITY
                    </div>
                  </div>

                  {workout.notes && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{workout.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-900/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      <WorkoutDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

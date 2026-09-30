import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Target, CheckCircle2, Circle } from 'lucide-react';
import { api } from '../store/useAuthStore';
import { GoalDrawer } from '../components/modules/goals/GoalDrawer';

export const GoalsPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [timeframeFilter, setTimeframeFilter] = useState<string>('MONTHLY');
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', timeframeFilter],
    queryFn: async () => {
      const res = await api.get(`/goals${timeframeFilter !== 'ALL' ? `?timeframe=${timeframeFilter}` : ''}`);
      return res.data;
    }
  });

  const toggleAchievedMutation = useMutation({
    mutationFn: async ({ id, is_achieved }: { id: string, is_achieved: boolean }) => {
      await api.patch(`/goals/${id}`, { is_achieved });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsDrawerOpen(true);
  };

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setIsDrawerOpen(true);
  };

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, val }: { id: string, val: number }) => {
      await api.patch(`/goals/${id}`, { current_value: val });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Goals & OKRs</h1>
          <p className="text-gray-400 text-sm mt-1">Objectives and key results.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['ALL', 'WEEKLY', 'MONTHLY', 'SEMESTER', 'ANNUAL'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframeFilter(tf)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                timeframeFilter === tf 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-24 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />)
          ) : goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-[#141419] border border-white/5 rounded-2xl">
              <Target size={32} className="text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No goals defined for this timeframe.</p>
            </div>
          ) : (
            goals.map((goal: any) => (
              <div 
                key={goal.id}
                className={`bg-[#141419] border ${goal.is_achieved ? 'border-emerald-500/20' : 'border-white/5'} rounded-xl p-5 hover:border-violet-500/50 transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAchievedMutation.mutate({ id: goal.id, is_achieved: !goal.is_achieved });
                    }}
                    className="mt-1 flex-shrink-0 transition-transform active:scale-90"
                  >
                    {goal.is_achieved ? (
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    ) : (
                      <Circle size={24} className="text-gray-600 group-hover:text-violet-500 transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0" onClick={() => handleEditGoal(goal)}>
                    <div className="flex items-start justify-between cursor-pointer">
                      <div>
                        <h3 className={`font-medium text-lg truncate ${goal.is_achieved ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {goal.title}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                            {goal.category}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                            {goal.timeframe}
                          </span>
                        </div>
                      </div>
                      
                      {goal.target_value !== null && (
                        <div className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="text-sm font-mono text-white">
                            <span 
                              className="cursor-pointer border-b border-dashed border-gray-600 hover:border-violet-400 hover:text-violet-400"
                              onClick={() => {
                                const val = prompt('Update current value:', goal.current_value);
                                if (val && !isNaN(Number(val))) {
                                  updateProgressMutation.mutate({ id: goal.id, val: Number(val) });
                                }
                              }}
                            >
                              {goal.current_value}
                            </span>
                            <span className="text-gray-500 mx-1">/</span>
                            {goal.target_value} {goal.unit}
                          </div>
                          {/* Simple Progress Bar */}
                          <div className="w-24 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden ml-auto">
                            <div 
                              className={`h-full ${goal.is_achieved ? 'bg-emerald-500' : 'bg-violet-500'} rounded-full transition-all`}
                              style={{ width: `${Math.min(100, Math.max(0, (goal.current_value / goal.target_value) * 100))}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {goal.description && (
                      <p className="mt-3 text-sm text-gray-400 line-clamp-2 cursor-pointer">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleCreateGoal}
        className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-900/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      <GoalDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        goal={selectedGoal}
      />
    </div>
  );
};

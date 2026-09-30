import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../store/useAuthStore';
import { ZoroOrb } from '../components/orb/ZoroOrb';
import { TaskSummaryCard } from '../components/dashboard/TaskSummaryCard';
import { HabitStreakGrid } from '../components/dashboard/HabitStreakGrid';
import { ExpenseBurnGauge } from '../components/dashboard/ExpenseBurnGauge';
import { FitnessStatusCard } from '../components/dashboard/FitnessStatusCard';

interface DashboardSummary {
  tasks: {
    incomplete_count: number;
    urgent_deadline: string | null;
  };
  habits: {
    completed_today: number;
  };
  expenses: {
    spent_today: number;
    spent_this_month: number;
    monthly_budget: number;
  };
  fitness: {
    workout_completed_today: boolean;
  };
}

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data;
    },
    refetchInterval: 60000, // Poll every minute
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Central Command Section */}
      <div className="flex flex-col items-center justify-center py-12 mb-8">
        <ZoroOrb size="lg" state={isLoading ? 'THINKING' : (error ? 'ERROR' : 'IDLE')} />
        <h1 className="mt-8 text-3xl font-display font-light text-white tracking-wide">
          ZORO Command Center
        </h1>
        <p className="mt-2 text-gray-400 font-mono text-sm">
          System Operational • Awaiting Directives
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TaskSummaryCard 
          incompleteCount={data?.tasks.incomplete_count ?? 0}
          urgentDeadline={data?.tasks.urgent_deadline ?? undefined}
          isLoading={isLoading}
        />
        
        <HabitStreakGrid 
          completedToday={data?.habits.completed_today ?? 0}
          isLoading={isLoading}
        />
        
        <ExpenseBurnGauge 
          spentToday={data?.expenses.spent_today ?? 0}
          spentThisMonth={data?.expenses.spent_this_month ?? 0}
          monthlyBudget={data?.expenses.monthly_budget ?? 50000}
          isLoading={isLoading}
        />
        
        <FitnessStatusCard 
          workoutCompletedToday={data?.fitness.workout_completed_today ?? false}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

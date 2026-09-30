import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, IndianRupee, PieChart, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../store/useAuthStore';
import { ExpenseDrawer } from '../components/modules/expenses/ExpenseDrawer';

const MONTHLY_BUDGET = 50000; // Hardcoded for now, move to user settings later

export const ExpensesPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await api.get(`/expenses`);
      return res.data;
    }
  });

  const { data: analytics = { total_spent: 0, category_breakdown: [] }, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['expenseAnalytics'],
    queryFn: async () => {
      const res = await api.get(`/expenses/analytics`);
      return res.data;
    }
  });

  const percentSpent = Math.min((analytics.total_spent / MONTHLY_BUDGET) * 100, 100);

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Finances</h1>
          <p className="text-gray-400 text-sm mt-1">Track capital allocation.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-8">
        
        {/* Budget Progress */}
        <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Spent This Month</p>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-400 text-lg">₹</span>
                <span className="text-4xl font-display text-white">{analytics.total_spent.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="text-sm text-gray-400">₹{MONTHLY_BUDGET.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${percentSpent > 90 ? 'bg-red-500' : percentSpent > 75 ? 'bg-orange-500' : 'bg-emerald-500'}`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        {analytics.category_breakdown.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PieChart size={14} /> Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {analytics.category_breakdown.map((item: any) => (
                <div key={item.category} className="bg-[#0f0f13] border border-white/5 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase">{item.category}</span>
                  <span className="text-sm font-bold text-white">₹{item.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={14} /> Recent Transactions
          </h3>
          <div className="space-y-2">
            {isLoadingExpenses ? (
              [1, 2, 3].map(i => <div key={i} className="h-16 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />)
            ) : expenses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No transactions found.</p>
            ) : (
              expenses.map((expense: any) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-[#141419] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                      <IndianRupee size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase">{expense.category}</p>
                      {expense.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{expense.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-white">-₹{expense.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{format(new Date(expense.expense_date), 'MMM d, h:mm a')}</p>
                  </div>
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

      <ExpenseDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

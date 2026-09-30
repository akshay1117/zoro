import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ExpenseBurnGaugeProps {
  spentToday: number;
  spentThisMonth: number;
  monthlyBudget: number;
  isLoading: boolean;
}

export const ExpenseBurnGauge: React.FC<ExpenseBurnGaugeProps> = ({ 
  spentToday, 
  spentThisMonth, 
  monthlyBudget, 
  isLoading 
}) => {
  if (isLoading) {
    return <div className="h-40 rounded-xl bg-surface/50 border border-white/5 animate-pulse" />;
  }

  const percentage = Math.min((spentThisMonth / monthlyBudget) * 100, 100);
  const remaining = Math.max(monthlyBudget - spentThisMonth, 0);
  
  const data = [
    { name: 'Spent', value: spentThisMonth },
    { name: 'Remaining', value: remaining }
  ];
  
  const COLORS = ['#ec4899', '#27272a']; // pink-500 and zinc-800

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface border border-white/5 rounded-xl p-5 hover:border-pink-500/30 transition-colors relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
          <TrendingDown size={14} className="text-pink-500" />
          Expenses
        </h3>
      </div>
      
      <div className="flex items-end justify-between relative z-10">
        <div>
          <div className="text-gray-500 text-xs mb-1">Spent Today</div>
          <div className="flex items-baseline gap-1 text-white">
            <IndianRupee size={16} className="text-pink-500" />
            <span className="text-3xl font-display font-light">
              {spentToday.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-gray-500 text-xs mb-1">Monthly Burn</div>
          <div className="text-sm text-gray-300 font-medium">
            {percentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Background Gauge */}
      <div className="absolute -bottom-12 -right-4 w-40 h-40 opacity-40 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={65}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

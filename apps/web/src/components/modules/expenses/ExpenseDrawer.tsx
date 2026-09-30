import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Tag, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface ExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'ACADEMICS', 'SHOPPING', 'BILLS', 'OTHER'
];

export const ExpenseDrawer: React.FC<ExpenseDrawerProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [description, setDescription] = useState('');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newExpense: any) => {
      const response = await api.post('/expenses', newExpense);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      setAmount('');
      setCategory('FOOD');
      setDescription('');
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    createMutation.mutate({
      amount: Number(amount),
      category,
      description: description || null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[80vh] md:h-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl bg-[#0f0f13] border-t md:border border-white/10 z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-light text-white">Log Expense</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Amount (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xl font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pl-8 pr-0 py-3 text-3xl font-display text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition-all ${
                        category === c 
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                          : 'bg-transparent border-white/10 text-gray-500 hover:bg-white/5'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !amount}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg transition-colors"
                >
                  {createMutation.isPending ? 'Logging...' : 'Log Expense'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

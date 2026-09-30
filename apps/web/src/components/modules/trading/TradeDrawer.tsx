import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface TradeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeDrawer: React.FC<TradeDrawerProps> = ({ isOpen, onClose }) => {
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newTrade: any) => {
      const response = await api.post('/trading/trades', newTrade);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setSymbol('');
      setType('BUY');
      setQuantity('');
      setPrice('');
      setNotes('');
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !price) return;
    
    createMutation.mutate({
      symbol,
      type,
      quantity: parseFloat(quantity),
      price_at_execution: parseFloat(price),
      notes: notes || null,
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
            className="fixed bottom-0 left-0 right-0 h-[85vh] md:h-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl bg-[#0f0f13] border-t md:border border-white/10 z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-light text-white">Log Trade</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="BTC"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    min="0"
                    placeholder="0.0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
              
              {quantity && price && (
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-white font-medium">${(parseFloat(quantity) * parseFloat(price)).toLocaleString()}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="Thesis / catalyst..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#141419] border border-white/10 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 min-h-[80px] resize-none transition-colors"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !symbol || !quantity || !price}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg transition-colors"
                >
                  {createMutation.isPending ? 'Logging...' : 'Log Trade'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

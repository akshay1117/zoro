import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../store/useAuthStore';
import { TradeDrawer } from '../components/modules/trading/TradeDrawer';

export const TradingPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: portfolio, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await api.get(`/trading/portfolio`);
      return res.data;
    }
  });

  const { data: trades = [], isLoading: isLoadingTrades } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const res = await api.get(`/trading/trades`);
      return res.data;
    }
  });

  // Example mutation to update portfolio snapshot value
  const updateSnapshotMutation = useMutation({
    mutationFn: async (val: number) => {
      await api.post(`/trading/portfolio/snapshot`, {
        total_value: val,
        cash_balance: portfolio?.cash_balance || 0
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] })
  });

  return (
    <div className="p-6 max-w-3xl mx-auto h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Trading</h1>
          <p className="text-gray-400 text-sm mt-1">Capital markets operation.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-8">
        
        {/* Portfolio Value */}
        <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Net Portfolio Value</p>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-400 text-xl">$</span>
                <span className="text-4xl font-display text-white">
                  {portfolio?.current_value ? portfolio.current_value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const val = prompt('Update Portfolio Value ($):', portfolio?.current_value || '0');
                if (val && !isNaN(Number(val))) updateSnapshotMutation.mutate(Number(val));
              }}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
            >
              <RefreshCcw size={18} className={updateSnapshotMutation.isPending ? 'animate-spin text-violet-400' : ''} />
            </button>
          </div>
        </div>

        {/* Asset Allocation */}
        {portfolio?.allocation?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Current Holdings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {portfolio.allocation.map((item: any) => (
                <div key={item.symbol} className="bg-[#0f0f13] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-white">{item.symbol}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {item.quantity.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Trades */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Trade Ledger</h3>
          <div className="space-y-2">
            {isLoadingTrades ? (
              [1, 2].map(i => <div key={i} className="h-16 bg-surface/50 border border-white/5 rounded-xl animate-pulse" />)
            ) : trades.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No trades recorded.</p>
            ) : (
              trades.map((trade: any) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-[#141419] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {trade.type === 'BUY' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {trade.type} {trade.symbol}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(trade.trade_date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white font-mono">
                      {trade.quantity} @ ${trade.price_at_execution.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ${(trade.quantity * trade.price_at_execution).toLocaleString()}
                    </p>
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

      <TradeDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Mic, Send, Bot, User as UserIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface ZoroCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZoroCommandMenu: React.FC<ZoroCommandMenuProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const res = await api.get('/ai/history');
      return res.data;
    },
    enabled: isOpen
  });

  const chatMutation = useMutation({
    mutationFn: async (msg: string) => {
      const res = await api.post('/ai/chat', { content: msg });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : document.dispatchEvent(new CustomEvent('open-zoro-command'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, chatMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    
    chatMutation.mutate(input);
    setInput('');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-12 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] h-[80vh] bg-[#0f0f13] border border-white/10 rounded-2xl z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header / Input Area */}
            <div className="p-4 border-b border-white/5 bg-[#141419]">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 relative">
                <Terminal size={18} className="text-violet-500" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Zoro to analyze expenses, track a habit..."
                  autoFocus
                  className="flex-1 bg-transparent text-white focus:outline-none placeholder-gray-600 font-mono text-sm"
                />
                <button type="submit" disabled={!input.trim() || chatMutation.isPending} className="p-2 text-gray-500 hover:text-violet-400 transition-colors disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {history.length === 0 && !chatMutation.isPending ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                  <Bot size={48} className="text-gray-800" />
                  <p className="text-sm font-mono text-center max-w-[250px]">
                    ZORO Core Online. Awaiting command...
                  </p>
                </div>
              ) : (
                history.map((msg: any) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-[#1a1a20] text-gray-200 border border-white/5 rounded-tr-sm' 
                        : 'bg-violet-600/10 text-violet-100 border border-violet-500/20 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-[#1a1a20] border border-white/5 flex items-center justify-center flex-shrink-0">
                        <UserIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {chatMutation.isPending && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-violet-600/10 border border-violet-500/20 rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-[#141419] flex justify-between items-center text-xs text-gray-600 font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">esc</span> to close
              </div>
              <div className="flex items-center gap-1 text-emerald-500/50">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM SECURE
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

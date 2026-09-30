import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Pin } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../store/useAuthStore';

interface NoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  note?: any;
}

export const NoteDrawer: React.FC<NoteDrawerProps> = ({ isOpen, onClose, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isPinned, setIsPinned] = useState(false);
  
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content_markdown);
      setCategory(note.category);
      setIsPinned(note.is_pinned);
    } else {
      setTitle('');
      setContent('');
      setCategory('GENERAL');
      setIsPinned(false);
    }
  }, [note, isOpen]);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (noteData: any) => {
      if (note) {
        const response = await api.patch(`/notes/${note.id}`, noteData);
        return response.data;
      } else {
        const response = await api.post('/notes', noteData);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (note) {
        await api.delete(`/notes/${note.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    }
  });

  const handleSave = () => {
    if (!title || !content) return;
    
    saveMutation.mutate({
      title,
      content_markdown: content,
      category,
      is_pinned: isPinned
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
            className="fixed bottom-0 left-0 right-0 h-[90vh] md:h-[85vh] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:rounded-2xl bg-[#0f0f13] border-t md:border border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-2 rounded-lg transition-colors ${
                    isPinned ? 'bg-violet-500/20 text-violet-400' : 'hover:bg-white/5 text-gray-500'
                  }`}
                >
                  <Pin size={18} />
                </button>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-sm text-gray-400 focus:outline-none focus:text-white uppercase tracking-wider font-medium"
                >
                  <option value="GENERAL">General</option>
                  <option value="RESEARCH">Research</option>
                  <option value="IDEA">Idea</option>
                  <option value="JOURNAL">Journal</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                {note && (
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this note?")) {
                        deleteMutation.mutate();
                      }
                    }}
                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saveMutation.isPending || !title || !content}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <Save size={16} />
                  {saveMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-2xl font-display font-medium text-white focus:outline-none placeholder-gray-600"
              />
              <textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[300px] bg-transparent text-gray-300 placeholder-gray-700 focus:outline-none resize-none font-mono text-sm leading-relaxed"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

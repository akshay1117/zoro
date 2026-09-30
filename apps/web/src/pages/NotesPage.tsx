import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, FileText, Pin } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../store/useAuthStore';
import { NoteDrawer } from '../components/modules/notes/NoteDrawer';

export const NotesPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', searchQuery],
    queryFn: async () => {
      const res = await api.get(`/notes${searchQuery ? `?search=${searchQuery}` : ''}`);
      return res.data;
    }
  });

  const handleEditNote = (note: any) => {
    setSelectedNote(note);
    setIsDrawerOpen(true);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-light text-white tracking-wide">Zettelkasten</h1>
          <p className="text-gray-400 text-sm mt-1">Knowledge management & personal notes.</p>
        </div>
        
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-[#141419] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-48 bg-surface/50 border border-white/5 rounded-2xl animate-pulse" />)
          ) : notes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-48 bg-[#141419] border border-white/5 rounded-2xl">
              <FileText size={32} className="text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No notes found.</p>
            </div>
          ) : (
            notes.map((note: any) => (
              <div 
                key={note.id}
                onClick={() => handleEditNote(note)}
                className="bg-[#141419] border border-white/5 rounded-2xl p-5 hover:border-violet-500/50 hover:bg-[#1a1a20] transition-all cursor-pointer group flex flex-col h-48"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-lg line-clamp-1 group-hover:text-violet-400 transition-colors">
                    {note.title}
                  </h3>
                  {note.is_pinned && <Pin size={14} className="text-violet-400 shrink-0 ml-2" />}
                </div>
                
                <p className="text-xs text-gray-400 font-mono line-clamp-4 flex-1 mt-2">
                  {note.content_markdown}
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                    {note.category}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    {format(new Date(note.updated_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleCreateNote}
        className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-violet-900/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      <NoteDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        note={selectedNote}
      />
    </div>
  );
};

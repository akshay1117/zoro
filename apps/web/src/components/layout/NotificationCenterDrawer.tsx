import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, AlertTriangle, Lightbulb, Activity, CheckCircle, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../store/useAuthStore';

interface NotificationCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationIcon = ({ type, isRead }: { type: string, isRead: boolean }) => {
  const colorClass = isRead ? 'text-gray-500' : 'text-white';
  switch (type) {
    case 'DEADLINE': return <Clock size={16} className={isRead ? 'text-gray-500' : 'text-rose-500'} />;
    case 'HABIT_REMINDER': return <Activity size={16} className={isRead ? 'text-gray-500' : 'text-emerald-500'} />;
    case 'EXPENSE_ALERT': return <AlertTriangle size={16} className={isRead ? 'text-gray-500' : 'text-amber-500'} />;
    case 'AI_INSIGHT': return <Lightbulb size={16} className={isRead ? 'text-gray-500' : 'text-violet-500'} />;
    default: return <Bell size={16} className={colorClass} />;
  }
};

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const drawerRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    enabled: isOpen
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => await api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications_unread'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => await api.patch(`/notifications/read-all`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications_unread'] });
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleMarkAll = () => {
    markAllReadMutation.mutate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute top-16 right-4 md:right-8 w-[360px] max-h-[500px] bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
        >
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#141419]">
            <h3 className="font-display font-medium text-white flex items-center gap-2">
              <Bell size={16} className="text-violet-500" />
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleMarkAll}
                disabled={markAllReadMutation.isPending || notifications.every((n: any) => n.is_read)}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <CheckCircle size={12} />
                Mark all read
              </button>
              <button onClick={onClose} className="p-1 text-gray-500 hover:text-white rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 flex gap-3 transition-colors ${
                      notif.is_read ? 'bg-transparent' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notif.is_read ? 'bg-white/5' : 'bg-violet-500/20'
                      }`}>
                        <NotificationIcon type={notif.notification_type} isRead={notif.is_read} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm mb-1 ${notif.is_read ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-2 font-mono">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <button 
                        onClick={() => markReadMutation.mutate(notif.id)}
                        className="self-center p-1.5 text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors flex-shrink-0"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

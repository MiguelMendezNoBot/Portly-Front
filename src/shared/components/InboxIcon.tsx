import { useState, useEffect, useRef } from 'react';
import { Notification } from '../../modules/notifications/domain/Notification';
import { notificationService } from '../../modules/notifications/services/notificationService';
import { useAuth } from '../../modules/home/presentation/hooks/useAuth';

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  return date.toLocaleDateString();
};

export const InboxIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Fetch count
    const fetchCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (count > unreadCount) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 3000); // Animation duration
        }
        setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();
    // Poll every 30s
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user, unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleInbox = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      // Fetch messages
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOneAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      // Optimizacion optimista
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await notificationService.markOneAsRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleInbox}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 border border-violet-200 hover:bg-violet-200 transition-colors cursor-pointer shrink-0 ${isAnimating ? 'animate-ring' : ''}`}
        aria-label="Notificaciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 max-h-[400px] overflow-y-auto bg-src-0f111a border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 animate-dropdown-open scrollbar-thin">
          <div className="p-4 border-b border-white/5 sticky top-0 bg-src-0f111a/95 backdrop-blur-sm z-10 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold tracking-wide">Notificaciones</h3>
              {unreadCount > 0 && <span className="text-xs text-src-6b72ff bg-src-6b72ff/20 px-2 py-1 rounded-full font-bold">{unreadCount} nuevas</span>}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-slate-400 hover:text-white transition-colors text-left"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className="flex flex-col">
            {notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">Estás al día</p>
                <p className="text-slate-500 text-xs mt-1">No tienes notificaciones nuevas</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isWarning = notif.mensaje.toLowerCase().includes('suspend') || notif.mensaje.toLowerCase().includes('restring');
                return (
                  <div 
                    key={notif.id} 
                    onClick={() => handleMarkOneAsRead(notif.id, notif.leido)}
                    className={`relative p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all duration-500 cursor-pointer flex gap-3 pl-6 ${!notif.leido ? 'bg-violet-900/10' : ''}`}
                  >
                    {!notif.leido && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-opacity duration-500"></div>
                    )}
                    
                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isWarning ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'} ${notif.leido ? 'opacity-60' : 'opacity-100'}`}>
                      {isWarning ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed transition-colors duration-500 ${!notif.leido ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {notif.mensaje}
                      </p>
                      <span className="text-xs text-slate-500 mt-1 block font-medium">
                        {getRelativeTime(notif.fechaCreacion)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

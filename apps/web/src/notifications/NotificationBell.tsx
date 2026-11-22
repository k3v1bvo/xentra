import React, { useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { useTenantStore } from '../stores/tenantStore';
import { useAuthStore } from '../stores/authStore';
import { NotificationCenter } from './NotificationCenter';

export const NotificationBell: React.FC = () => {
  const { notifications, isOpen, toggleOpen, setIsOpen } = useNotificationStore();
  const { currentOtb } = useTenantStore();
  const { currentRole } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const isSuperadmin = currentRole === 'superadmin';
  const isVecino = currentRole === 'vecino';

  const visibleNotifications = notifications.filter((n) => {
    if (!isSuperadmin && n.otb_id && currentOtb && n.otb_id !== currentOtb.id) {
      return false;
    }
    if (isVecino) {
      return n.recipient_user_id === 'demo-vecino' || n.category === 'Pagos' || n.category === 'Cuotas' || n.category === 'VOTA';
    } else {
      return n.recipient_user_id !== 'demo-vecino';
    }
  });

  const unreadCount = visibleNotifications.filter((n) => !n.read_at && !n.archived_at).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleOpen}
        aria-label="Notificaciones"
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <NotificationCenter onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

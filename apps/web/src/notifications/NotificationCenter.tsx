import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Vote,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { NotificationCategory } from '@xentra/shared';

interface NotificationCenterProps {
  onClose: () => void;
}

const CATEGORIES: { label: string; value: NotificationCategory | 'ALL' }[] = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Pagos', value: 'Pagos' },
  { label: 'Cuotas', value: 'Cuotas' },
  { label: 'Auditoría', value: 'Auditoria' },
  { label: 'VOTA', value: 'VOTA' },
  { label: 'Proyectos', value: 'Proyectos' }
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    filterCategory,
    setFilterCategory,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  const filtered = notifications
    .filter((n) => !n.archived_at)
    .filter((n) => (filterCategory === 'ALL' ? true : n.category === filterCategory));

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'Pagos':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'Auditoria':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'VOTA':
        return <Vote className="w-4 h-4 text-blue-600" />;
      case 'Seguridad':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = async (notif: typeof notifications[0]) => {
    if (!notif.read_at) {
      await markAsRead(notif.id);
    }
    if (notif.action_route) {
      navigate(notif.action_route);
      onClose();
    }
  };

  return (
    <div className="w-[340px] sm:w-[420px] rounded-2xl bg-[#0B132B] shadow-2xl border-2 border-slate-700/80 overflow-hidden flex flex-col max-h-[85vh] text-white">
      {/* Encabezado */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#030712]">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-sm tracking-tight">Centro de Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {unreadCount} nuevas
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Marcar leídas
          </button>
        )}
      </div>

      {/* Filtro de Categorías */}
      <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#020617]">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilterCategory(c.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === c.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Lista de Notificaciones */}
      <div className="overflow-y-auto divide-y divide-slate-800 flex-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-400 mx-auto flex items-center justify-center mb-3 border border-slate-800">
              <CheckCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">Bandeja al día</p>
            <p className="text-xs text-slate-400 mt-0.5">No tienes notificaciones pendientes en esta categoría.</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const isUnread = !notif.read_at;
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-slate-800/50 ${
                  isUnread ? 'bg-blue-950/30' : 'bg-transparent'
                }`}
              >
                <div className="mt-0.5 w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(notif.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`text-xs truncate ${isUnread ? 'font-black text-white' : 'font-medium text-slate-300'}`}>
                      {notif.title}
                    </p>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {notif.body}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.created_at).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.action_route && (
                      <span className="text-[11px] text-blue-400 font-bold flex items-center gap-0.5 hover:underline">
                        Ver detalle <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pie con estado de conexión */}
      <div className="p-2.5 bg-[#030712] border-t border-slate-800 text-center">
        <span className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Conectado en tiempo real a la OTB
        </span>
      </div>
    </div>
  );
};

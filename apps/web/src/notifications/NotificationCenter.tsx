import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Vote,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  X,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { useTenantStore } from '../stores/tenantStore';
import { useAuthStore } from '../stores/authStore';
import { NotificationCategory, Notification } from '@xentra/shared';

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
  const { currentOtb } = useTenantStore();
  const { currentRole } = useAuthStore();
  const {
    notifications,
    filterCategory,
    setFilterCategory,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  const isSuperadmin = currentRole === 'superadmin';
  const isVecino = currentRole === 'vecino';

  // Filtrar notificaciones por OTB y por Rol
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

  const filtered = visibleNotifications
    .filter((n) => !n.archived_at)
    .filter((n) => (filterCategory === 'ALL' ? true : n.category === filterCategory));

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'Pagos':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'Auditoria':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'VOTA':
        return <Vote className="w-4 h-4 text-blue-400" />;
      case 'Seguridad':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  // Normalizador de rutas seguras para evitar 404 o expulsiones al inicio
  const resolveTargetRoute = (route?: string): string | null => {
    if (!route) return null;

    if (isVecino) {
      if (route.startsWith('/admin')) {
        return '/vecino';
      }
      return route;
    }

    // Para directiva y superadmin
    if (route === '/finanzas') return '/admin/finanzas';
    if (route === '/auditor') return '/admin/auditor';
    if (route === '/vota') return '/admin/vota';
    if (route === '/vecinos') return '/admin/vecinos';
    if (route === '/trace') return '/admin/trace';
    return route;
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read_at) {
      await markAsRead(notif.id);
    }
    setSelectedNotif(notif);
  };

  const handleExecuteAction = (route?: string) => {
    const target = resolveTargetRoute(route);
    if (target) {
      navigate(target);
      onClose();
    }
  };

  return (
    <div className="w-[340px] sm:w-[420px] rounded-2xl bg-[#0B132B] shadow-2xl border-2 border-slate-700/80 overflow-hidden flex flex-col max-h-[85vh] text-white">
      {/* Encabezado */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#030712]">
        <div className="flex items-center gap-2">
          {selectedNotif ? (
            <button
              onClick={() => setSelectedNotif(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a la lista</span>
            </button>
          ) : (
            <>
              <h3 className="font-bold text-white text-sm tracking-tight">Centro de Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {unreadCount} nuevas
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!selectedNotif && unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Marcar todas como leídas"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Leídas</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar notificaciones"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VISTA A: DETALLE EXPANDIDO DE LA NOTIFICACIÓN SELECCIONADA */}
      {selectedNotif ? (
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                {getCategoryIcon(selectedNotif.category)}
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 block">
                  Categoría: {selectedNotif.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(selectedNotif.created_at).toLocaleString('es-BO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              selectedNotif.priority === 'high'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {selectedNotif.priority === 'high' ? 'Prioridad Alta' : 'Informativo'}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-white text-base leading-snug">
              {selectedNotif.title}
            </h4>
            <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>{selectedNotif.body}</p>
            </div>
          </div>

          {/* Botones de Acción de la Notificación */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              onClick={() => setSelectedNotif(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer text-center"
            >
              Cerrar Detalle
            </button>

            {selectedNotif.action_route && (
              <button
                onClick={() => handleExecuteAction(selectedNotif.action_route)}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ir a la Sección</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* VISTA B: LISTADO FILTRABLE DE NOTIFICACIONES */
        <>
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
                    className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-slate-800/60 ${
                      isUnread ? 'bg-blue-950/25' : 'bg-transparent'
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
                        <span className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5">
                          Ver contenido <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Pie con estado de conexión */}
      <div className="p-2.5 bg-[#030712] border-t border-slate-800 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
        <span className="text-[11px] text-slate-400 font-medium">
          Conectado en tiempo real • {currentOtb?.name || 'OTB Villa Esperanza'}
        </span>
      </div>
    </div>
  );
};

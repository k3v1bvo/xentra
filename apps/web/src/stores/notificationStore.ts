import { create } from 'zustand';
import { Notification, NotificationCategory } from '@xentra/shared';
import { supabase } from '../lib/supabaseClient';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  filterCategory: NotificationCategory | 'ALL';
  isOpen: boolean;
  setFilterCategory: (category: NotificationCategory | 'ALL') => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  initRealtime: (userId: string, otbId: string) => () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    // Notificaciones para la Directiva (Tesorería / Presidencia)
    {
      id: 'notif-1',
      recipient_user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      otb_id: '11111111-1111-1111-1111-111111111111',
      type: 'PAYMENT_RECEIVED',
      category: 'Pagos',
      title: 'Abono Registrado en Caja',
      body: 'El vecino Juan José Flores amortizó Bs. 50,00 para el Fondo Pro-Tinglado.',
      priority: 'normal',
      action_route: '/admin/finanzas',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'notif-2',
      recipient_user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      otb_id: '11111111-1111-1111-1111-111111111111',
      type: 'AUDIT_ALERT',
      category: 'Auditoria',
      title: 'Alerta Preventiva de AI Auditor',
      body: 'Se detectó un egreso de Bs. 850,00 sin comprobante de respaldo adjunto.',
      priority: 'high',
      action_route: '/admin/auditor',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'notif-3',
      recipient_user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      otb_id: '11111111-1111-1111-1111-111111111111',
      type: 'POLL_CREATED',
      category: 'VOTA',
      title: 'Nueva Consulta Vecinal Abierta',
      body: 'La directiva ha publicado la consulta "Priorización de Obras 2027". Participa y vota.',
      priority: 'normal',
      action_route: '/admin/vota',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    // Notificaciones para el Socio / Vecino
    {
      id: 'notif-vec-1',
      recipient_user_id: 'demo-vecino',
      otb_id: '11111111-1111-1111-1111-111111111111',
      type: 'PAYMENT_RECEIVED',
      category: 'Pagos',
      title: 'Comprobante Aprobado y Certificado',
      body: 'Tu abono de Bs. 50,00 para el Fondo Pro-Tinglado fue confirmado con Recibo N° OTB-CBBA-001-2026-00042.',
      priority: 'normal',
      action_route: '/verificar-recibo?receipt=OTB-CBBA-001-2026-00042',
      created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: 'notif-vec-2',
      recipient_user_id: 'demo-vecino',
      otb_id: '11111111-1111-1111-1111-111111111111',
      type: 'FEE_ASSIGNED',
      category: 'Cuotas',
      title: 'Nueva Cuota Mensual Asignada',
      body: 'Se ha generado la Cuota Ordinaria Noviembre 2026 por Bs. 25,00 con vencimiento al 30 de noviembre.',
      priority: 'normal',
      action_route: '/vecino',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'notif-vec-3',
      recipient_user_id: 'demo-vecino',
      otb_id: '11111111-1111-1111-1111-111111111111',
      type: 'POLL_CREATED',
      category: 'VOTA',
      title: 'Asamblea y Consulta Barrial Activa',
      body: 'La Mesa Directiva convoca a todos los socios a la consulta para la Priorización de Obras 2027.',
      priority: 'normal',
      action_route: '/vecino',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    }
  ],
  unreadCount: 3,
  filterCategory: 'ALL',
  isOpen: false,

  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  markAsRead: async (id: string) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      );
      const unread = updated.filter((n) => !n.read_at && !n.archived_at).length;
      return { notifications: updated, unreadCount: unread };
    });

    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);
    } catch {
      // Manejo silencioso en offline o demo
    }
  },

  markAllAsRead: async () => {
    const now = new Date().toISOString();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read_at: now })),
      unreadCount: 0
    }));

    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        await supabase
          .from('notifications')
          .update({ read_at: now })
          .eq('recipient_user_id', user.user.id)
          .is('read_at', null);
      }
    } catch {
      // Manejo seguro
    }
  },

  archiveNotification: async (id: string) => {
    const now = new Date().toISOString();
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, archived_at: now } : n
      );
      const unread = updated.filter((n) => !n.read_at && !n.archived_at).length;
      return { notifications: updated, unreadCount: unread };
    });
  },

  addNotification: (notification: Notification) => {
    set((state) => {
      // Control de duplicados por dedupe_key o id
      const exists = state.notifications.some(
        (n) => n.id === notification.id || (n.dedupe_key && n.dedupe_key === notification.dedupe_key)
      );
      if (exists) return state;

      const updated = [notification, ...state.notifications];
      const unread = updated.filter((n) => !n.read_at && !n.archived_at).length;
      return { notifications: updated, unreadCount: unread };
    });
  },

  initRealtime: (userId: string, otbId: string) => {
    const channel = supabase
      .channel(`user-notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new && (payload.new as Notification).otb_id === otbId) {
            get().addNotification(payload.new as Notification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));

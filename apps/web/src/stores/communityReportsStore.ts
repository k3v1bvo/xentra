import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';

export type ReportCategory =
  | 'borracho_cancha'
  | 'perro_peligro'
  | 'fuga_agua'
  | 'auto_sospechoso'
  | 'luminaria'
  | 'basura'
  | 'ruido';

export type ReportStatus = 'pendiente' | 'en_camino' | 'atendiendo' | 'resuelto';

export interface CommunityReport {
  id: string;
  otbId: string;
  otbName: string;
  category: ReportCategory;
  categoryLabel: string;
  title: string;
  description: string;
  location: string;
  socioCode: string;
  neighborName: string;
  lotName: string;
  reportedByPublic: string;
  phoneContact?: string;
  ciNumber?: string;
  isVerifiedNeighbor?: boolean;
  reporterType?: 'socio_acreditado' | 'vecino_externo';
  photoName?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number;
  mapUrl?: string;
  status: ReportStatus;
  statusLabel: string;
  createdAt: string;
  timestamp: string;
  actionNotes?: string;
}

interface NewReportInput {
  otbId: string;
  otbName: string;
  category: ReportCategory;
  title: string;
  description: string;
  location: string;
  socioCode: string;
  neighborName: string;
  lotName: string;
  phoneContact?: string;
  ciNumber?: string;
  isVerifiedNeighbor?: boolean;
  reporterType?: 'socio_acreditado' | 'vecino_externo';
  photoName?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number;
}

interface CommunityReportsState {
  reports: CommunityReport[];
  addReport: (input: NewReportInput) => CommunityReport;
  updateReportStatus: (reportId: string, status: ReportStatus, actionNotes?: string) => void;
  getReportsByOtb: (otbId: string) => CommunityReport[];
}

const STORAGE_KEY = 'xentra_community_reports_store';

export const CATEGORY_METADATA: Record<
  ReportCategory,
  { label: string; urgency: 'alta' | 'media' | 'normal'; defaultIcon: string; badgeColor: string }
> = {
  borracho_cancha: {
    label: 'Persona en estado de ebriedad / echada en cancha o calle',
    urgency: 'alta',
    defaultIcon: 'Beer',
    badgeColor: 'rose'
  },
  perro_peligro: {
    label: 'Perrito / mascota atropellada o en peligro',
    urgency: 'alta',
    defaultIcon: 'HeartPulse',
    badgeColor: 'amber'
  },
  fuga_agua: {
    label: 'Fuga de agua potable / desagüe colapsado',
    urgency: 'media',
    defaultIcon: 'Droplets',
    badgeColor: 'cyan'
  },
  auto_sospechoso: {
    label: 'Auto sospechoso o personas rondando de noche',
    urgency: 'alta',
    defaultIcon: 'AlertTriangle',
    badgeColor: 'rose'
  },
  luminaria: {
    label: 'Poste sin luz / calle a oscuras',
    urgency: 'normal',
    defaultIcon: 'Lightbulb',
    badgeColor: 'yellow'
  },
  basura: {
    label: 'Basural clandestino / escombros en acera',
    urgency: 'normal',
    defaultIcon: 'Trash2',
    badgeColor: 'slate'
  },
  ruido: {
    label: 'Fiesta clandestina / exceso de bulla nocturna',
    urgency: 'normal',
    defaultIcon: 'Volume2',
    badgeColor: 'purple'
  }
};

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-ve-01',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Esperanza',
    category: 'borracho_cancha',
    categoryLabel: 'Persona en estado de ebriedad / echada en cancha o calle',
    title: 'Persona descompensada en graderías de la cancha comunal',
    description: 'Hay un varón recostado sobre las graderías de la cancha polifuncional desde hace 1 hora con olor a bebidas alcohólicas. No responde al saludo.',
    location: 'Cancha Polifuncional - Manzana B',
    socioCode: 'SOC-005',
    neighborName: 'Silvia Rojas Vargas',
    lotName: 'Manzana B, Lote 05',
    reportedByPublic: 'Vecina Mz B - Lote 05 (SOC-005)',
    phoneContact: '79812345',
    status: 'en_camino',
    statusLabel: 'Directiva y Ronda Vecinal en camino',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timestamp: 'Hace 15 minutos',
    actionNotes: 'El Presidente Don Roberto acude con el botiquín de primeros auxilios y coordinación con Radiopatrullas 110.'
  },
  {
    id: 'rep-ve-02',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Esperanza',
    category: 'perro_peligro',
    categoryLabel: 'Perrito / mascota atropellada o en peligro',
    title: 'Cachorrito herido en la esquina de la Sede Comunal',
    description: 'Un perrito mestizo color café fue rozado por una moto y se refugió asustado bajo la jardinera de la sede. Necesita veterinario o curación.',
    location: 'Av. Petrolera Km 4 esq. Calle Los Ceibos',
    socioCode: 'SOC-012',
    neighborName: 'Juan José Flores Morales',
    lotName: 'Manzana A, Lote 12',
    reportedByPublic: 'Vecino Mz A - Lote 12 (SOC-012)',
    phoneContact: '74567890',
    status: 'atendiendo',
    statusLabel: 'Vecinos del sector brindando auxilio',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timestamp: 'Hace 45 minutos',
    actionNotes: 'Vecina María llevó gasas y agua. Se busca al dueño o voluntario de Zoonosis.'
  },
  {
    id: 'rep-ve-03',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Esperanza',
    category: 'auto_sospechoso',
    categoryLabel: 'Auto sospechoso o personas rondando de noche',
    title: 'Vagoneta polarizada sin placa detenida con luces apagadas',
    description: 'Vagoneta blanca sin placa trasera estacionada en la curva oscura con 3 ocupantes observando las viviendas.',
    location: 'Pasaje Las Retamas - Manzana C',
    socioCode: 'SOC-001',
    neighborName: 'Roberto Gómez Montaño',
    lotName: 'Manzana C, Lote 01',
    reportedByPublic: 'Vecino Mz C - Lote 01 (SOC-001)',
    phoneContact: '72345678',
    status: 'en_camino',
    statusLabel: 'Ronda Vecinal alertada • Llamada a Radiopatrullas 110',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    timestamp: 'Hace 1 hora y media',
    actionNotes: 'Ronda comunitaria con silbatos activada y patrulla policial notificada.'
  },
  {
    id: 'rep-ve-04',
    otbId: '11111111-1111-1111-1111-111111111111',
    otbName: 'Villa Esperanza',
    category: 'fuga_agua',
    categoryLabel: 'Fuga de agua potable / desagüe colapsado',
    title: 'Fuga de agua potable por rotura de matriz',
    description: 'Chorro de agua saliendo de la acera principal frente al lote 18 perdiendo agua limpia.',
    location: 'Calle Principal frente a Manzana B',
    socioCode: 'SOC-018',
    neighborName: 'Carlos Mendizábal',
    lotName: 'Manzana B, Lote 18',
    reportedByPublic: 'Vecino Mz B - Lote 18 (SOC-018)',
    status: 'resuelto',
    statusLabel: 'Reparado con cuadrilla SEMAPA y fontanero del barrio',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timestamp: 'Ayer 16:30',
    actionNotes: 'Válvula de paso reemplazada con cargo a fondo menor de emergencias.'
  },
  // Reporte en OTB Los Pinos (aislado para demostrar filtro estricto multi-tenant)
  {
    id: 'rep-lp-01',
    otbId: '22222222-2222-2222-2222-222222222222',
    otbName: 'Los Pinos',
    category: 'luminaria',
    categoryLabel: 'Poste sin luz / calle a oscuras',
    title: 'Luminaria apagada en rotonda central',
    description: 'Dos postes sin iluminación en la rotonda sur.',
    location: 'Rotonda Sur - Bloque 4',
    socioCode: 'PINO-033',
    neighborName: 'Gonzalo Peñaranda',
    lotName: 'Bloque 4, Depto 201',
    reportedByPublic: 'Vecino Bloque 4 (PINO-033)',
    status: 'atendiendo',
    statusLabel: 'Reclamo ingresado a DePaz',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    timestamp: 'Hace 3 horas'
  }
];

const loadReports = (): CommunityReport[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error al cargar reportes comunitarios:', e);
  }
  return INITIAL_REPORTS;
};

const saveReports = (reports: CommunityReport[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Error al guardar reportes comunitarios:', e);
  }
};

export const useCommunityReportsStore = create<CommunityReportsState>((set, get) => ({
  reports: loadReports(),

  addReport: (input) => {
    const meta = CATEGORY_METADATA[input.category] || CATEGORY_METADATA.borracho_cancha;

    // Crear reporte firmado por el socio y aislado para su OTB
    const isAccredited = input.isVerifiedNeighbor !== false;
    const reportedByPublic = isAccredited
      ? `${input.neighborName} (${input.socioCode} • ${input.lotName})`
      : `${input.neighborName} (Vecino no censado • ${input.lotName})`;

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      otbId: input.otbId,
      otbName: input.otbName,
      category: input.category,
      categoryLabel: meta.label,
      title: input.title,
      description: input.description,
      location: input.location,
      socioCode: input.socioCode,
      neighborName: input.neighborName,
      lotName: input.lotName,
      reportedByPublic,
      phoneContact: input.phoneContact,
      ciNumber: input.ciNumber,
      isVerifiedNeighbor: isAccredited,
      reporterType: isAccredited ? 'socio_acreditado' : 'vecino_externo',
      photoName: input.photoName,
      photoUrl: input.photoUrl,
      latitude: input.latitude,
      longitude: input.longitude,
      gpsAccuracy: input.gpsAccuracy,
      mapUrl: input.latitude && input.longitude
        ? `https://www.google.com/maps?q=${input.latitude},${input.longitude}`
        : undefined,
      status: 'pendiente',
      statusLabel: 'Alerta enviada a la Mesa Directiva y Ronda Vecinal',
      createdAt: new Date().toISOString(),
      timestamp: 'Justo ahora'
    };

    const updated = [newReport, ...get().reports];
    saveReports(updated);
    set({ reports: updated });

    // Notificación en tiempo real a la Directiva de la OTB
    try {
      useNotificationStore.getState().addNotification({
        id: `notif-${Date.now()}`,
        recipient_user_id: 'directiva-otb',
        otb_id: input.otbId,
        type: 'SYSTEM_ALERT',
        category: 'Comunidad' as any,
        title: `🚨 Alerta Comunitaria Urgente (${input.socioCode})`,
        body: `${input.title} en "${input.location}". Reportado por ${input.neighborName} (${input.lotName}).`,
        priority: 'urgent' as any,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('No se pudo despachar la notificación visual:', e);
    }

    return newReport;
  },

  updateReportStatus: (reportId, status, actionNotes) => {
    const statusLabels: Record<ReportStatus, string> = {
      pendiente: 'Alerta registrada • Pendiente de asignación',
      en_camino: 'Directiva y Ronda Vecinal en camino al lugar',
      atendiendo: 'Incidente siendo atendido en el punto',
      resuelto: 'Incidente solucionado y archivado'
    };

    const updated = get().reports.map((rep) => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status,
          statusLabel: statusLabels[status],
          actionNotes: actionNotes || rep.actionNotes
        };
      }
      return rep;
    });

    saveReports(updated);
    set({ reports: updated });

    try {
      useNotificationStore.getState().addNotification({
        id: `notif-${Date.now()}`,
        recipient_user_id: 'directiva-otb',
        otb_id: 'otb-general',
        type: 'SYSTEM_ALERT',
        category: 'Comunidad' as any,
        title: `Estado Actualizado: ${statusLabels[status]}`,
        body: `El reporte #${reportId.slice(-6)} ha cambiado a "${status}".`,
        priority: 'normal' as any,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      // Ignorar error si no está disponible
    }
  },

  getReportsByOtb: (otbId) => {
    return get().reports.filter((r) => r.otbId === otbId);
  }
}));

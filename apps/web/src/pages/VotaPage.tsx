import React, { useState } from 'react';
import {
  Vote,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BarChart3,
  Users,
  Check,
  TrendingUp,
  Plus,
  Bell,
  FileText,
  Clock,
  MapPin,
  Megaphone,
  X,
  Share2,
  Edit3,
  Trash2
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';
import { TiltCard3D } from '../components/TiltCard3D';

interface PollMock {
  id: string;
  otbId?: string;
  title: string;
  description: string;
  estimatedBudget: number;
  endDate: string;
  options: { id: string; title: string; votes: number }[];
  totalVotes: number;
  userVotedOptionId?: string;
  createdBy: string;
}

interface CommunityNewsMock {
  id: string;
  otbId?: string;
  title: string;
  type: 'asamblea' | 'noticia' | 'balance' | 'urgente';
  date: string;
  time: string;
  location: string;
  description: string;
  agenda?: string[];
  publishedBy: string;
}

const INITIAL_POLLS: PollMock[] = [
  {
    id: 'poll-1',
    otbId: '11111111-1111-1111-1111-111111111111',
    title: 'Priorización de Obras Comunitarias — Gestión 2027',
    description: 'Consulta a los vecinos para definir el destino del fondo de inversión municipal y contraparte comunitaria.',
    estimatedBudget: 35000.00,
    endDate: '15/12/2026',
    options: [
      { id: 'opt-1', title: 'Pavimentado de Pasaje Los Álamos (Manzana A)', votes: 24 },
      { id: 'opt-2', title: 'Instalación de 8 Cámaras de Seguridad y Sirena Vecinal', votes: 19 },
      { id: 'opt-3', title: 'Refacción y Juegos Infantiles en la Plaza Central', votes: 7 }
    ],
    totalVotes: 50,
    userVotedOptionId: undefined,
    createdBy: 'Mesa Directiva OTB'
  },
  {
    id: 'poll-lpz-1',
    otbId: '22222222-2222-2222-2222-222222222222',
    title: 'Ampliación de Muros de Contención y Graderías en Sector 2',
    description: 'Votación para aprobar el aporte pro-estabilización de taludes antes de la temporada de lluvias.',
    estimatedBudget: 42000.00,
    endDate: '20/12/2026',
    options: [
      { id: 'opt-lpz-1', title: 'Muro de gaviones en el pasaje superior', votes: 18 },
      { id: 'opt-lpz-2', title: 'Iluminación solar en graderías peatonales', votes: 12 }
    ],
    totalVotes: 30,
    userVotedOptionId: undefined,
    createdBy: 'Directiva OTB Los Pinos'
  },
  {
    id: 'poll-scz-1',
    otbId: '33333333-3333-3333-3333-333333333333',
    title: 'Mejoramiento de Pavimento Articulado y Drenaje Pluvial UV 45',
    description: 'Priorización de losetas y desagües para evitar anegamientos en época de lluvia.',
    estimatedBudget: 55000.00,
    endDate: '28/12/2026',
    options: [
      { id: 'opt-scz-1', title: 'Canal de drenaje pluvial hacia el 4to Anillo', votes: 25 },
      { id: 'opt-scz-2', title: 'Pavimentado con losetas de la calle central', votes: 31 }
    ],
    totalVotes: 56,
    userVotedOptionId: undefined,
    createdBy: 'Junta Vecinal Barrio Lindo'
  }
];

const INITIAL_NEWS: CommunityNewsMock[] = [
  {
    id: 'news-1',
    otbId: '11111111-1111-1111-1111-111111111111',
    title: 'Convocatoria a Asamblea General Ordinaria — Rendición Trimestral',
    type: 'asamblea',
    date: 'Domingo 29 de Noviembre, 2026',
    time: '09:00 AM (Tolerancia 15 min)',
    location: 'Sede Social OTB Villa Esperanza (Av. Petrolera Km 4)',
    description: 'Se convoca a todos los socios activos de las Manzanas A, B, C y D a la asamblea ordinaria de rendición de cuentas e informe de avance del Tinglado.',
    agenda: [
      '1. Control de asistencia y quórum reglamentario.',
      '2. Informe financiero de Tesorería (Ingresos por QR y cuotas cobradas).',
      '3. Avance de obra: Tinglado de la Cancha Polifuncional.',
      '4. Varios y aprobación de actas.'
    ],
    publishedBy: 'Presidente & Tesorería OTB'
  },
  {
    id: 'news-2',
    otbId: '11111111-1111-1111-1111-111111111111',
    title: 'Corte Programado de Agua Potable por Mantenimiento de Matriz',
    type: 'urgente',
    date: 'Miércoles 25 de Noviembre, 2026',
    time: '08:00 AM a 14:00 PM',
    location: 'Manzanas B y C — Calles Las Retamas y Los Pinos',
    description: 'Se realizarán trabajos de reparación en la tubería principal de distribución. Tomar previsiones y almacenar agua con anticipación.',
    publishedBy: 'Comité de Agua y Servicios'
  },
  {
    id: 'news-lpz-1',
    otbId: '22222222-2222-2222-2222-222222222222',
    title: 'Asamblea Extraordinaria — Seguridad Ciudadana y Sirenas',
    type: 'asamblea',
    date: 'Sábado 28 de Noviembre, 2026',
    time: '18:30 PM',
    location: 'Sede Comunal Los Pinos (Calle 25)',
    description: 'Coordinación con la Estación Policial Integral (EPI) Sur para patrullajes nocturnos.',
    agenda: [
      '1. Instalación de pulsadores de pánico vecinales.',
      '2. Turnos de vigilancia ciudadana comunitaria.'
    ],
    publishedBy: 'Directiva OTB Los Pinos'
  },
  {
    id: 'news-scz-1',
    otbId: '33333333-3333-3333-3333-333333333333',
    title: 'Campaña de Fumigación y Limpieza Barrial contra el Dengue',
    type: 'urgente',
    date: 'Domingo 30 de Noviembre, 2026',
    time: '07:30 AM',
    location: 'Plaza Principal Barrio Lindo',
    description: 'Jornada de deschatarrización comunitaria coordinada con el centro de salud municipal.',
    publishedBy: 'Comité de Salud y Medio Ambiente'
  }
];

export const VotaPage: React.FC = () => {
  const { currentRole } = useAuthStore();
  const { currentOtb } = useTenantStore();
  const isSuperadmin = currentRole === 'superadmin';
  const currentOtbId = currentOtb?.id || '11111111-1111-1111-1111-111111111111';

  const [activeTab, setActiveTab] = useState<'votaciones' | 'asambleas'>('votaciones');

  const [polls, setPolls] = useState<PollMock[]>(INITIAL_POLLS);
  const [news, setNews] = useState<CommunityNewsMock[]>(INITIAL_NEWS);
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Filtrado Estricto por OTB (solo superadmin ve a nivel nacional)
  const visiblePolls = isSuperadmin
    ? polls
    : polls.filter((p) => p.otbId === currentOtbId);

  const visibleNews = isSuperadmin
    ? news
    : news.filter((n) => n.otbId === currentOtbId);

  // Modales de creación (Solo para Directiva / Admin)
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [showCreateNewsModal, setShowCreateNewsModal] = useState(false);

  // Formulario nueva votación
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollDesc, setNewPollDesc] = useState('');
  const [newPollBudget, setNewPollBudget] = useState('20000');
  const [newPollEndDate, setNewPollEndDate] = useState('31/12/2026');
  const [newPollOption1, setNewPollOption1] = useState('');
  const [newPollOption2, setNewPollOption2] = useState('');
  const [newPollOption3, setNewPollOption3] = useState('');

  // Formulario nueva convocatoria/noticia
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsType, setNewNewsType] = useState<'asamblea' | 'noticia' | 'urgente'>('asamblea');
  const [newNewsDate, setNewNewsDate] = useState('');
  const [newNewsTime, setNewNewsTime] = useState('09:00 AM');
  const [newNewsLocation, setNewNewsLocation] = useState('Sede Social OTB');
  const [newNewsDesc, setNewNewsDesc] = useState('');
  const [newNewsAgenda, setNewNewsAgenda] = useState('');

  // CRUD Votaciones: Editar y Eliminar
  const [editingPoll, setEditingPoll] = useState<PollMock | null>(null);
  const [editPollTitle, setEditPollTitle] = useState('');
  const [editPollDesc, setEditPollDesc] = useState('');
  const [editPollBudget, setEditPollBudget] = useState('');
  const [editPollEndDate, setEditPollEndDate] = useState('');
  const [deletingPoll, setDeletingPoll] = useState<PollMock | null>(null);

  // CRUD Convocatorias: Editar y Eliminar
  const [editingNews, setEditingNews] = useState<CommunityNewsMock | null>(null);
  const [editNewsTitle, setEditNewsTitle] = useState('');
  const [editNewsType, setEditNewsType] = useState<CommunityNewsMock['type']>('asamblea');
  const [editNewsDate, setEditNewsDate] = useState('');
  const [editNewsTime, setEditNewsTime] = useState('');
  const [editNewsLocation, setEditNewsLocation] = useState('');
  const [editNewsDesc, setEditNewsDesc] = useState('');
  const [editNewsAgenda, setEditNewsAgenda] = useState('');
  const [deletingNews, setDeletingNews] = useState<CommunityNewsMock | null>(null);

  const isAdmin = currentRole === 'presidente' || currentRole === 'tesorero' || currentRole === 'superadmin';

  const handleVote = (pollId: string) => {
    if (!selectedOption) return;

    setPolls(
      polls.map((p) => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          totalVotes: p.totalVotes + 1,
          userVotedOptionId: selectedOption,
          options: p.options.map((opt) =>
            opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      })
    );
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollTitle || !newPollOption1 || !newPollOption2) {
      alert('Por favor ingresa al menos el título y 2 opciones de votación.');
      return;
    }

    const options = [
      { id: `opt-${Date.now()}-1`, title: newPollOption1, votes: 0 },
      { id: `opt-${Date.now()}-2`, title: newPollOption2, votes: 0 },
    ];
    if (newPollOption3.trim()) {
      options.push({ id: `opt-${Date.now()}-3`, title: newPollOption3, votes: 0 });
    }

    const created: PollMock = {
      id: `poll-${Date.now()}`,
      otbId: currentOtbId,
      title: newPollTitle,
      description: newPollDesc || 'Consulta vecinal para decisión comunitaria.',
      estimatedBudget: parseFloat(newPollBudget) || 0,
      endDate: newPollEndDate,
      options,
      totalVotes: 0,
      createdBy: `${currentOtb?.name || 'Mesa Directiva'}`
    };

    setPolls([created, ...polls]);
    setShowCreatePollModal(false);
    setNewPollTitle('');
    setNewPollDesc('');
    setNewPollOption1('');
    setNewPollOption2('');
    setNewPollOption3('');
    alert('¡Nueva consulta comunitaria publicada con éxito para los vecinos!');
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsDesc) {
      alert('Por favor ingresa el título y la descripción.');
      return;
    }

    const agendaList = newNewsAgenda
      ? newNewsAgenda.split('\n').filter((item) => item.trim().length > 0)
      : undefined;

    const created: CommunityNewsMock = {
      id: `news-${Date.now()}`,
      otbId: currentOtbId,
      title: newNewsTitle,
      type: newNewsType,
      date: newNewsDate || 'Próximo Fin de Semana',
      time: newNewsTime,
      location: newNewsLocation,
      description: newNewsDesc,
      agenda: agendaList,
      publishedBy: `${currentOtb?.name || 'Directiva OTB'}`
    };

    setNews([created, ...news]);
    setShowCreateNewsModal(false);
    setNewNewsTitle('');
    setNewNewsDesc('');
    setNewNewsDate('');
    setNewNewsAgenda('');
    alert('¡Convocatoria oficial comunicada a la comunidad!');
  };

  // CRUD Votaciones: Iniciar Edición
  const handleStartEditPoll = (poll: PollMock) => {
    setEditingPoll(poll);
    setEditPollTitle(poll.title);
    setEditPollDesc(poll.description);
    setEditPollBudget(poll.estimatedBudget.toString());
    setEditPollEndDate(poll.endDate);
  };

  // CRUD Votaciones: Guardar Edición (Update)
  const handleSaveEditPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoll || !editPollTitle.trim()) return;

    setPolls(
      polls.map((p) => {
        if (p.id !== editingPoll.id) return p;
        return {
          ...p,
          title: editPollTitle.trim(),
          description: editPollDesc.trim(),
          estimatedBudget: parseFloat(editPollBudget) || 0,
          endDate: editPollEndDate
        };
      })
    );
    setEditingPoll(null);
    alert('¡Votación comunitaria actualizada con éxito!');
  };

  // CRUD Votaciones: Confirmar Eliminación (Delete)
  const handleConfirmDeletePoll = () => {
    if (!deletingPoll) return;
    setPolls(polls.filter((p) => p.id !== deletingPoll.id));
    setDeletingPoll(null);
  };

  // CRUD Convocatorias: Iniciar Edición
  const handleStartEditNews = (item: CommunityNewsMock) => {
    setEditingNews(item);
    setEditNewsTitle(item.title);
    setEditNewsType(item.type);
    setEditNewsDate(item.date);
    setEditNewsTime(item.time);
    setEditNewsLocation(item.location);
    setEditNewsDesc(item.description);
    setEditNewsAgenda(item.agenda ? item.agenda.join('\n') : '');
  };

  // CRUD Convocatorias: Guardar Edición (Update)
  const handleSaveEditNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editNewsTitle.trim()) return;

    const agendaList = editNewsAgenda
      ? editNewsAgenda.split('\n').filter((item) => item.trim().length > 0)
      : undefined;

    setNews(
      news.map((n) => {
        if (n.id !== editingNews.id) return n;
        return {
          ...n,
          title: editNewsTitle.trim(),
          type: editNewsType,
          date: editNewsDate.trim(),
          time: editNewsTime.trim(),
          location: editNewsLocation.trim(),
          description: editNewsDesc.trim(),
          agenda: agendaList
        };
      })
    );
    setEditingNews(null);
    alert('¡Convocatoria actualizada con éxito!');
  };

  // CRUD Convocatorias: Confirmar Eliminación (Delete)
  const handleConfirmDeleteNews = () => {
    if (!deletingNews) return;
    setNews(news.filter((n) => n.id !== deletingNews.id));
    setDeletingNews(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Democracia & Asambleas OTB
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Votaciones y Convocatorias Oficiales
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Espacio oficial de participación democrática, consultas vecinales y actas de asambleas de {currentOtb?.name}.
          </p>
        </div>

        {/* Botones de Acción para la Directiva / Admin */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowCreatePollModal(true)}
                className="h-12 px-5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Votación</span>
              </button>

              <button
                onClick={() => setShowCreateNewsModal(true)}
                className="h-12 px-5 rounded-2xl text-xs sm:text-sm font-black text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-purple-400" />
                <span>Publicar Convocatoria</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('votaciones')}
          className={`pb-2 px-3 text-sm font-black transition-colors relative cursor-pointer ${
            activeTab === 'votaciones'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🗳️ Consultas y Votaciones Activas ({visiblePolls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('asambleas')}
          className={`pb-2 px-3 text-sm font-black transition-colors relative cursor-pointer ${
            activeTab === 'asambleas'
              ? 'text-purple-400 border-b-2 border-purple-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📢 Convocatorias de Asambleas & Avisos ({visibleNews.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. SECCIÓN DE CONSULTAS Y VOTACIONES VECINALES                      */}
      {/* =================================================================== */}
      {activeTab === 'votaciones' && (
        <div className="space-y-6">
          {visiblePolls.map((poll) => {
            const hasVoted = !!poll.userVotedOptionId;

            return (
              <TiltCard3D key={poll.id}>
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                          Consulta Comunitaria Oficial
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          • Convocada por: {poll.createdBy}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white">{poll.title}</h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                        {poll.description}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0 space-y-1">
                      <span className="text-xs text-slate-400 block font-mono">
                        Cierre: {poll.endDate}
                      </span>
                      {poll.estimatedBudget > 0 && (
                        <span className="text-sm font-black text-blue-400 font-mono block">
                          Presupuesto Ref: {formatBOB(poll.estimatedBudget)}
                        </span>
                      )}
                      <span className="text-xs text-emerald-400 font-bold block">
                        {poll.totalVotes} votos emitidos
                      </span>

                      {/* Botones Directiva / Admin para CRUD */}
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 pt-1.5 justify-start sm:justify-end">
                          <button
                            onClick={() => handleStartEditPoll(poll)}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                            title="Editar consulta comunitaria"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => setDeletingPoll(poll)}
                            className="px-2 py-1 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                            title="Eliminar consulta"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opciones de Votación */}
                  <div className="space-y-3">
                    {poll.options.map((option) => {
                      const percentage = poll.totalVotes > 0
                        ? Math.round((option.votes / poll.totalVotes) * 100)
                        : 0;
                      const isSelected = selectedOption === option.id;
                      const isUserVoted = poll.userVotedOptionId === option.id;

                      return (
                        <div
                          key={option.id}
                          onClick={() => !hasVoted && setSelectedOption(option.id)}
                          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                            isUserVoted
                              ? 'bg-emerald-500/10 border-emerald-500/60'
                              : isSelected
                              ? 'bg-blue-500/15 border-blue-500 shadow-lg shadow-blue-500/20'
                              : 'bg-[#030712]/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Barra de progreso de fondo */}
                          {hasVoted && (
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-blue-500/15 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="relative z-10 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isUserVoted
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : isSelected
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-slate-600'
                                }`}
                              >
                                {(isUserVoted || isSelected) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <span className="font-bold text-sm sm:text-base text-white">
                                {option.title}
                              </span>
                            </div>

                            {hasVoted && (
                              <div className="text-right flex-shrink-0 font-mono">
                                <span className="font-black text-sm text-blue-400">{percentage}%</span>
                                <span className="text-[11px] text-slate-400 block font-normal">
                                  ({option.votes} votos)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Acciones de Voto */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {hasVoted ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>¡Tu voto fue registrado e imputado en el acta comunal!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Vote className="w-4 h-4 text-blue-400" />
                        <span>Elige una opción para emitir tu voto oficial como socio de la OTB.</span>
                      </div>
                    )}

                    {!hasVoted && (
                      <button
                        onClick={() => handleVote(poll.id)}
                        disabled={!selectedOption}
                        className="h-12 px-8 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer self-start sm:self-auto"
                      >
                        Emitir Mi Voto Oficial
                      </button>
                    )}
                  </div>
                </div>
              </TiltCard3D>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. SECCIÓN DE CONVOCATORIAS DE ASAMBLEAS & NOTICIAS TRIMESTRALES     */}
      {/* =================================================================== */}
      {activeTab === 'asambleas' && (
        <div className="space-y-5">
          {visibleNews.map((item) => (
            <TiltCard3D key={item.id}>
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        item.type === 'asamblea'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : item.type === 'urgente'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        {item.type === 'asamblea' ? 'Asamblea General Ordinaria' : item.type === 'urgente' ? 'Aviso Urgente Comunitario' : 'Comunicado'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Por: {item.publishedBy}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white">{item.title}</h2>
                  </div>

                  <div className="flex-shrink-0 text-left sm:text-right space-y-1">
                    <span className="text-xs font-bold text-amber-400 block flex items-center gap-1 sm:justify-end">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {item.time}
                    </span>

                    {/* Botones Directiva / Admin para CRUD */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 pt-1 justify-start sm:justify-end">
                        <button
                          onClick={() => handleStartEditNews(item)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          title="Editar convocatoria de asamblea"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeletingNews(item)}
                          className="px-2 py-1 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                          title="Eliminar convocatoria"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#030712]/90 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
                  <p className="flex items-center gap-2 font-bold text-blue-300">
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>Lugar: {item.location}</span>
                  </p>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                    {item.description}
                  </p>
                </div>

                {item.agenda && item.agenda.length > 0 && (
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <span className="text-xs font-black uppercase text-purple-300 block">
                      Orden del Día / Temario Oficial:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300 font-medium">
                      {item.agenda.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TiltCard3D>
          ))}
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: CREAR NUEVA CONSULTA DE VOTACIÓN (DIRECTIVA / ADMIN)       */}
      {/* =================================================================== */}
      {showCreatePollModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] border-2 border-slate-700 shadow-2xl overflow-hidden text-white">
            <div className="p-6 border-b border-slate-800 bg-[#030712]/90 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Crear Nueva Consulta Vecinal</h2>
                <p className="text-xs text-slate-400 mt-0.5">Votación democrática para socios de la OTB.</p>
              </div>
              <button
                onClick={() => setShowCreatePollModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Título de la Consulta:</label>
                <input
                  type="text"
                  required
                  value={newPollTitle}
                  onChange={(e) => setNewPollTitle(e.target.value)}
                  placeholder="Ej. Priorización de Obras 2027 o Seguridad Vecinal"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Descripción / Motivo:</label>
                <textarea
                  rows={2}
                  value={newPollDesc}
                  onChange={(e) => setNewPollDesc(e.target.value)}
                  placeholder="Explica a los vecinos en qué consiste la consulta..."
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Presupuesto Ref. (Bs.):</label>
                  <input
                    type="number"
                    value={newPollBudget}
                    onChange={(e) => setNewPollBudget(e.target.value)}
                    placeholder="35000"
                    className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Fecha Límite de Cierre:</label>
                  <input
                    type="text"
                    value={newPollEndDate}
                    onChange={(e) => setNewPollEndDate(e.target.value)}
                    placeholder="Ej. 15/12/2026"
                    className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="font-black text-blue-400 block uppercase tracking-wider text-[11px]">
                  Opciones de Votación:
                </label>
                <input
                  type="text"
                  required
                  value={newPollOption1}
                  onChange={(e) => setNewPollOption1(e.target.value)}
                  placeholder="Opción 1: Ej. Pavimentado Pasaje Los Álamos"
                  className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
                <input
                  type="text"
                  required
                  value={newPollOption2}
                  onChange={(e) => setNewPollOption2(e.target.value)}
                  placeholder="Opción 2: Ej. Instalación de Cámaras de Seguridad"
                  className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
                <input
                  type="text"
                  value={newPollOption3}
                  onChange={(e) => setNewPollOption3(e.target.value)}
                  placeholder="Opción 3 (Opcional): Ej. Mejoramiento Parque Central"
                  className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreatePollModal(false)}
                  className="h-11 px-5 text-slate-400 hover:text-white rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-600/30"
                >
                  Publicar Votación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: PUBLICAR CONVOCATORIA DE ASAMBLEA / NOTICIA OTB            */}
      {/* =================================================================== */}
      {showCreateNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] border-2 border-slate-700 shadow-2xl overflow-hidden text-white">
            <div className="p-6 border-b border-slate-800 bg-[#030712]/90 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Publicar Convocatoria o Noticia</h2>
                <p className="text-xs text-slate-400 mt-0.5">Comunicado formal para la asamblea de vecinos.</p>
              </div>
              <button
                onClick={() => setShowCreateNewsModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Título de la Convocatoria:</label>
                <input
                  type="text"
                  required
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  placeholder="Ej. Convocatoria a Asamblea Trimestral de Rendición"
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Tipo de Evento:</label>
                  <select
                    value={newNewsType}
                    onChange={(e) => setNewNewsType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="asamblea">Asamblea General Ordinaria</option>
                    <option value="urgente">Aviso Urgente Comunal</option>
                    <option value="noticia">Comunicado Oficial</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Fecha y Hora:</label>
                  <input
                    type="text"
                    required
                    value={newNewsDate}
                    onChange={(e) => setNewNewsDate(e.target.value)}
                    placeholder="Ej. Domingo 29 de Noviembre - 09:00 AM"
                    className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Lugar de Reunión:</label>
                <input
                  type="text"
                  required
                  value={newNewsLocation}
                  onChange={(e) => setNewNewsLocation(e.target.value)}
                  placeholder="Ej. Sede Social OTB Villa Esperanza (Av. Petrolera Km 4)"
                  className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Descripción / Comunicado:</label>
                <textarea
                  rows={2}
                  required
                  value={newNewsDesc}
                  onChange={(e) => setNewNewsDesc(e.target.value)}
                  placeholder="Redacta la convocatoria e instrucciones a los vecinos..."
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Orden del Día (un punto por línea):
                </label>
                <textarea
                  rows={3}
                  value={newNewsAgenda}
                  onChange={(e) => setNewNewsAgenda(e.target.value)}
                  placeholder="1. Quórum y asistencia&#10;2. Informe de Tesorería&#10;3. Avance de obra Tinglado"
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateNewsModal(false)}
                  className="h-11 px-5 text-slate-400 hover:text-white rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black shadow-lg shadow-purple-600/30"
                >
                  Publicar Convocatoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: EDITAR CONSULTA COMUNAL (UPDATE)            */}
      {/* ======================================================== */}
      {editingPoll && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-amber-500/50 p-6 sm:p-7 space-y-4 my-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 block tracking-wider">
                  Directiva OTB • Modificar Consulta
                </span>
                <h3 className="text-lg font-black text-white">Editar Consulta Comunal</h3>
              </div>
              <button
                onClick={() => setEditingPoll(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPoll} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Título de la Consulta</label>
                <input
                  type="text"
                  required
                  value={editPollTitle}
                  onChange={(e) => setEditPollTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-medium text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Descripción y Justificación</label>
                <textarea
                  rows={2}
                  required
                  value={editPollDesc}
                  onChange={(e) => setEditPollDesc(e.target.value)}
                  className="w-full p-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Presupuesto Referencial (BOB)</label>
                  <input
                    type="number"
                    step="100"
                    value={editPollBudget}
                    onChange={(e) => setEditPollBudget(e.target.value)}
                    className="w-full font-mono font-black text-white px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Fecha Límite de Cierre</label>
                  <input
                    type="text"
                    required
                    value={editPollEndDate}
                    onChange={(e) => setEditPollEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPoll(null)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: ELIMINAR CONSULTA COMUNAL (DELETE)          */}
      {/* ======================================================== */}
      {deletingPoll && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B132B] border-2 border-rose-500/50 shadow-2xl p-6 sm:p-7 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">¿Eliminar esta consulta vecinal?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Estás a punto de anular <strong className="text-white">{deletingPoll.title}</strong> con <strong className="text-emerald-400">{deletingPoll.totalVotes} votos registrados</strong>.
              </p>
            </div>

            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingPoll(null)}
                className="flex-1 h-12 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePoll}
                className="flex-1 h-12 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Eliminación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: EDITAR CONVOCATORIA DE ASAMBLEA (UPDATE)    */}
      {/* ======================================================== */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B132B] shadow-2xl border-2 border-purple-500/50 p-6 sm:p-7 space-y-4 my-auto text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 block tracking-wider">
                  Mesa Directiva • Modificar Convocatoria
                </span>
                <h3 className="text-lg font-black text-white">Editar Convocatoria / Aviso</h3>
              </div>
              <button
                onClick={() => setEditingNews(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditNews} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Título de la Convocatoria</label>
                <input
                  type="text"
                  required
                  value={editNewsTitle}
                  onChange={(e) => setEditNewsTitle(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Tipo de Evento</label>
                  <select
                    value={editNewsType}
                    onChange={(e) => setEditNewsType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white font-medium"
                  >
                    <option value="asamblea" className="bg-slate-900 text-white">Asamblea Ordinaria</option>
                    <option value="urgente" className="bg-slate-900 text-white">Aviso Urgente</option>
                    <option value="noticia" className="bg-slate-900 text-white">Comunicado General</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Fecha</label>
                  <input
                    type="text"
                    required
                    value={editNewsDate}
                    onChange={(e) => setEditNewsDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Hora y Tolerancia</label>
                  <input
                    type="text"
                    required
                    value={editNewsTime}
                    onChange={(e) => setEditNewsTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Lugar de Reunión</label>
                  <input
                    type="text"
                    required
                    value={editNewsLocation}
                    onChange={(e) => setEditNewsLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Descripción / Comunicado</label>
                <textarea
                  rows={2}
                  required
                  value={editNewsDesc}
                  onChange={(e) => setEditNewsDesc(e.target.value)}
                  className="w-full p-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Orden del Día (un punto por línea):
                </label>
                <textarea
                  rows={3}
                  value={editNewsAgenda}
                  onChange={(e) => setEditNewsAgenda(e.target.value)}
                  className="w-full p-3 bg-[#030712] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-black text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md shadow-purple-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL CRUD: ELIMINAR CONVOCATORIA (DELETE)              */}
      {/* ======================================================== */}
      {deletingNews && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0B132B] border-2 border-rose-500/50 shadow-2xl p-6 sm:p-7 space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Megaphone className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">¿Eliminar esta convocatoria?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vas a dar de baja el aviso <strong className="text-white">{deletingNews.title}</strong> programado para <strong className="text-amber-400">{deletingNews.date}</strong>.
              </p>
            </div>

            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingNews(null)}
                className="flex-1 h-12 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteNews}
                className="flex-1 h-12 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Baja</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

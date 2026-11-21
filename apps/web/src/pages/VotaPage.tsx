import React, { useState } from 'react';
import {
  Vote,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BarChart3,
  Users,
  Check,
  TrendingUp
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { useAuthStore } from '../stores/authStore';
import { TiltCard3D } from '../components/TiltCard3D';

interface PollMock {
  id: string;
  title: string;
  description: string;
  estimatedBudget: number;
  endDate: string;
  options: { id: string; title: string; votes: number }[];
  totalVotes: number;
  userVotedOptionId?: string;
}

const INITIAL_POLLS: PollMock[] = [
  {
    id: 'poll-1',
    title: 'Priorización de Obras Comunitarias — Gestión 2027',
    description: 'Consulta no vinculante a los vecinos para definir el destino del fondo de inversión municipal y aportes de contraparte comunitaria.',
    estimatedBudget: 35000.00,
    endDate: '15/12/2026',
    options: [
      { id: 'opt-1', title: 'Pavimentado de Pasaje Los Álamos (Manzana A)', votes: 24 },
      { id: 'opt-2', title: 'Instalación de 8 Cámaras de Seguridad y Sirena Vecinal', votes: 19 },
      { id: 'opt-3', title: 'Refacción y Juegos Infantiles en la Plaza Central', votes: 7 }
    ],
    totalVotes: 50,
    userVotedOptionId: undefined
  }
];

export const VotaPage: React.FC = () => {
  const { currentRole } = useAuthStore();
  const [polls, setPolls] = useState(INITIAL_POLLS);
  const [selectedOption, setSelectedOption] = useState<string>('');

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              XENTRA VOTA
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Democracia Participativa Vecinal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Consultas transparentes sobre prioridades de obras, proyectos de equipamiento y seguridad comunal.
          </p>
        </div>
      </div>

      {/* Consultas Activas */}
      <div className="space-y-6">
        {polls.map((poll) => {
          const hasVoted = !!poll.userVotedOptionId;

          return (
            <TiltCard3D key={poll.id}>
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                      Consulta Abierta a los Socios
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-white">{poll.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {poll.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0 space-y-1">
                    <span className="text-xs text-slate-400 block font-mono">
                      Cierre: {poll.endDate}
                    </span>
                    <span className="text-sm font-black text-blue-400 font-mono block">
                      Presupuesto Ref: {formatBOB(poll.estimatedBudget)}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold block">
                      {poll.totalVotes} votos registrados
                    </span>
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
                            className="absolute left-0 top-0 bottom-0 bg-blue-500/10 transition-all duration-500"
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
                      <span>¡Tu voto ha sido emitido y computado con éxito en el libro de actas!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Vote className="w-4 h-4 text-blue-400" />
                      <span>Selecciona una opción y presiona el botón para emitir tu voto oficial.</span>
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
    </div>
  );
};

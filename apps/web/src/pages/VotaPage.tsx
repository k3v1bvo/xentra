import React, { useState } from 'react';
import {
  Vote,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BarChart3,
  Users
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { useAuthStore } from '../stores/authStore';

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
    description: 'Consulta no vinculante a los vecinos para definir el destino del fondo de inversión municipal y aportes de contraparte.',
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              XENTRA VOTA
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
              Participación Vecinal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultas democráticas sobre prioridades de obras, infraestructura y seguridad comunal.
          </p>
        </div>
      </div>

      {/* Consultas Activas */}
      <div className="space-y-6">
        {polls.map((poll) => {
          const hasVoted = !!poll.userVotedOptionId;

          return (
            <div key={poll.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{poll.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{poll.description}</p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-[11px] text-slate-400 block font-mono">Cierre: {poll.endDate}</span>
                  <span className="text-xs font-bold text-blue-600 font-mono">
                    Presupuesto Ref: {formatBOB(poll.estimatedBudget)}
                  </span>
                </div>
              </div>

              {/* Opciones de Votación */}
              <div className="space-y-3">
                {poll.options.map((opt) => {
                  const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  const isSelected = poll.userVotedOptionId === opt.id || selectedOption === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !hasVoted && setSelectedOption(opt.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      {/* Barra de Porcentaje de Fondo */}
                      {hasVoted && (
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-blue-100/60 transition-all duration-500 -z-0"
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            checked={isSelected}
                            disabled={hasVoted}
                            onChange={() => setSelectedOption(opt.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-semibold text-slate-800">{opt.title}</span>
                        </div>

                        {hasVoted && (
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-blue-700">{percentage}%</span>
                            <span className="text-slate-400 text-[11px]">({opt.votes} votos)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pie de Votación */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Total participación: <strong className="text-slate-800 font-mono">{poll.totalVotes} vecinos</strong></span>
                </div>

                {!hasVoted ? (
                  <button
                    onClick={() => handleVote(poll.id)}
                    disabled={!selectedOption}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
                  >
                    Emitir Mi Voto
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tu voto ha sido registrado y blindado por base de datos</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

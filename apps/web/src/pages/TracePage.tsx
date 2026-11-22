import React from 'react';
import {
  GitBranch,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Building,
  CheckCircle2,
  ExternalLink,
  Layers,
  Lock,
  ArrowDown,
  MessageCircle,
  Printer
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { TiltCard3D } from '../components/TiltCard3D';
import { useTenantStore } from '../stores/tenantStore';

export const TracePage: React.FC = () => {
  const { currentOtb } = useTenantStore();
  const otbName = currentOtb?.name || 'OTB Villa Graciela';

  const shareText = `🏛️ *${otbName} - Rendición de Cuentas y Obras*\n\nInformamos a los vecinos el avance del proyecto "Tinglado Cancha Polifuncional":\n• Recaudado en aportes: Bs. 8.500,00 (100% cobrado)\n• Materiales adquiridos: Bs. 3.800,00 (Factura N° 004819)\n• Mano de obra calificada: Bs. 2.400,00 (Recibo y CI)\n• Saldo en cuenta comunal: Bs. 2.300,00\n\nTodos los comprobantes y facturas están respaldados para revisión de cualquier vecino.`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Libro de Movimientos y Cuentas Claras
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {otbName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cada aporte de los vecinos tiene un destino transparente: Aportes Cobrados → Fondo de Obra → Comprobantes y Facturas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Compartir por WhatsApp</span>
          </a>

          <button
            onClick={() => window.print()}
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-black text-slate-300 bg-[#0B132B]/90 border border-slate-700 hover:border-slate-500 hover:text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimir para Asamblea</span>
          </button>
        </div>
      </div>

      {/* Banner Informativo */}
      <TiltCard3D>
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-[#0B132B] to-[#0B132B] border-2 border-blue-500/30 text-white shadow-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-sm sm:text-base text-white">
              Cuentas Claras: Destino Específico de Cada Aporte Comunal
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Los aportes de los vecinos se destinan exclusivamente a los proyectos aprobados en asamblea.
              Aquí se comprueba exactamente en qué se invirtió cada boliviano, con sus facturas y recibos respaldados
              a la vista de cualquier socio de la comunidad.
            </p>
          </div>
        </div>
      </TiltCard3D>

      {/* Visualización del Destino de Fondos */}
      <TiltCard3D>
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                Destino y Ejecución de Recursos
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Proyecto: "Tinglado Metálico Cancha Polifuncional" ({otbName})
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold self-start sm:self-auto">
              ✓ Rendición Respaldada
            </span>
          </div>

          {/* Nodos Visuales en Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* NODO 1: RECAUDACIÓN DE APORTES */}
            <div className="p-5 rounded-2xl bg-[#030712]/90 border-2 border-slate-800 hover:border-blue-500/50 transition-all space-y-3 relative group">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Paso 1: Recaudación
              </span>
              <h3 className="font-black text-sm text-white">Aportes Vecinales Pro-Tinglado</h3>
              <p className="text-xs text-slate-400">Recaudado de 42 cuotas extraordinarias de vecinos</p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-base font-black font-mono text-emerald-400">{formatBOB(8500.00)}</span>
                <span className="text-[10px] font-bold text-slate-500 font-mono">100% cobrado</span>
              </div>
            </div>

            {/* NODO 2: FONDO COMUNITARIO */}
            <div className="p-5 rounded-2xl bg-[#030712]/90 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all space-y-3 relative group">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                Paso 2: Fondo Destino
              </span>
              <h3 className="font-black text-sm text-blue-300">Fondo Comunitario de Obras</h3>
              <p className="text-xs text-slate-400">Custodia en Subcuenta de Aportes de Construcción</p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-base font-black font-mono text-blue-400">{formatBOB(8500.00)}</span>
                <span className="text-[10px] font-bold text-blue-400 font-mono">En Tesorería</span>
              </div>
            </div>

            {/* NODO 3: ASIGNACIÓN A PROYECTO */}
            <div className="p-5 rounded-2xl bg-[#030712]/90 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all space-y-3 relative group">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">
                Paso 3: Proyecto Aprobado
              </span>
              <h3 className="font-black text-sm text-purple-300">Tinglado Cancha</h3>
              <p className="text-xs text-slate-400">Presupuesto total OTB: Bs. 15,000.00</p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-base font-black font-mono text-purple-400">Asignado: {formatBOB(8500.00)}</span>
                <span className="text-[10px] font-bold text-purple-400 font-mono">Fase 1</span>
              </div>
            </div>

            {/* NODO 4: EGRESOS Y COMPROBANTES */}
            <div className="p-5 rounded-2xl bg-[#030712]/90 border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all space-y-3 relative group">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                Paso 4: Ejecución Real
              </span>
              <h3 className="font-black text-sm text-emerald-300">Gastos con Comprobante</h3>
              <p className="text-xs text-slate-400">2 facturas verificadas e inspeccionadas</p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-base font-black font-mono text-emerald-400">Ejecutado: {formatBOB(6200.00)}</span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Saldo: Bs. 2.300</span>
              </div>
            </div>
          </div>

          {/* Detalle de Comprobantes Vinculados */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Comprobantes y Evidencias de Respaldo Inmutables</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">2 registros auditados</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#030712]/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black flex-shrink-0 text-base">
                    F
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Compra de Perfiles de Acero y Calaminas N° 28</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Proveedor: "Ferretería El Tornillo S.R.L." • Factura N° 004819
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      Comprobante Registrado: FACT-004819 • Archivo físico en Sede Social
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="font-mono font-black text-white text-base block">{formatBOB(3800.00)}</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-1">
                    ✓ Respaldo Verificado
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#030712]/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black flex-shrink-0 text-base">
                    R
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Mano de Obra Estructura Metálica y Soldadura</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Maestro Soldador: Faustino Choque • Recibo Oficial con Fotocopia CI
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      Comprobante Registrado: REC-MANO-OBRA-012 • Archivo físico en Sede Social
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="font-mono font-black text-white text-base block">{formatBOB(2400.00)}</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-1">
                    ✓ Respaldo Verificado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard3D>
    </div>
  );
};

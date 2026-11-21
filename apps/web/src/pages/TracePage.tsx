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
  ArrowDown
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';
import { TiltCard3D } from '../components/TiltCard3D';
import { useTenantStore } from '../stores/tenantStore';

export const TracePage: React.FC = () => {
  const { currentOtb } = useTenantStore();
  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              XENTRA TRACE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Contabilidad Inmutable & Anti-Desvío
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seguimiento honesto y auditable del flujo de recursos: Aportes → Fondos Comunitarios → Proyectos → Gastos Ejecutados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="h-12 px-5 rounded-2xl text-xs sm:text-sm font-black text-slate-300 bg-[#0B132B]/90 border border-slate-700 hover:border-slate-500 hover:text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Descargar Informe PDF</span>
          </button>
        </div>
      </div>

      {/* Banner Informativo de Honestidad Contable */}
      <TiltCard3D>
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-[#0B132B] to-[#0B132B] border-2 border-blue-500/30 text-white shadow-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-sm sm:text-base text-white">
              Principio de Trazabilidad por Fondos y Asignación Directa
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              El dinero de la comunidad se agrupa en cuentas y fondos específicos autorizados por asamblea vecinal.
              XENTRA TRACE demuestra con precisión matemática la imputación de los aportes recaudados y los comprobantes
              fiscales o recibos que respaldan cada centavo gastado, sin riesgo de cajas negras ni desvíos.
            </p>
          </div>
        </div>
      </TiltCard3D>

      {/* Visualización del Grafo TRACE en 3D */}
      <TiltCard3D>
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B132B]/90 border-2 border-slate-800 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                Cadena de Trazabilidad Comunal
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Grafo de Destino de Recursos — "Proyecto Tinglado Cancha Polifuncional" ({currentOtb?.name || 'Villa Esperanza'})
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold self-start sm:self-auto">
              Auditoría Verificada
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
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Hash SHA-256: 4a8e2b9c7d1e0f3a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a
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
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Hash SHA-256: 9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c
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

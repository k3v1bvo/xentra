import React from 'react';
import {
  GitBranch,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { formatBOB } from '@xentra/shared';

export const TracePage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              XENTRA TRACE
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
              Trazabilidad Contable
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Seguimiento honesto y auditable del flujo de recursos: Aportes → Fondos Comunitarios → Proyectos → Gastos Ejecutados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Descargar Informe PDF
          </button>
        </div>
      </div>

      {/* Banner Informativo de Honestidad Contable */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Principio de Trazabilidad por Fondos y Asignación:</p>
          <p className="text-blue-700 mt-0.5 leading-relaxed">
            El dinero de la comunidad se agrupa en cuentas y fondos específicos autorizados por la asamblea.
            XENTRA TRACE demuestra con precisión matemática la imputación de los aportes recaudados y los comprobantes
            fiscales o recibos que respaldan cada centavo gastado.
          </p>
        </div>
      </div>

      {/* Visualización del Grafo TRACE */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-fintech space-y-6">
        <h2 className="text-sm font-bold text-slate-900">
          Grafo de Destino de Recursos — "Proyecto Tinglado Cancha Polifuncional"
        </h2>

        {/* Nodos Visuales en Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* NODO 1: RECAUDACIÓN DE APORTES */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paso 1: Recaudación</span>
            <h3 className="font-bold text-xs text-slate-900">Aportes Vecinales Pro-Tinglado</h3>
            <p className="text-[11px] text-slate-500">Recaudado de 42 cuotas extraordinarias</p>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-sm font-extrabold font-mono text-emerald-600">{formatBOB(8500.00)}</span>
            </div>
          </div>

          {/* NODO 2: FONDO COMUNITARIO */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Paso 2: Fondo Destino</span>
            <h3 className="font-bold text-xs text-blue-900">Fondo Comunitario de Obras</h3>
            <p className="text-[11px] text-blue-700">Custodia en Caja Central Efectivo</p>
            <div className="pt-2 border-t border-blue-200">
              <span className="text-sm font-extrabold font-mono text-blue-700">{formatBOB(8500.00)}</span>
            </div>
          </div>

          {/* NODO 3: ASIGNACIÓN A PROYECTO */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">Paso 3: Proyecto Aprobado</span>
            <h3 className="font-bold text-xs text-purple-900">Tinglado Cancha</h3>
            <p className="text-[11px] text-purple-700">Presupuesto total: Bs. 15,000</p>
            <div className="pt-2 border-t border-purple-200">
              <span className="text-sm font-extrabold font-mono text-purple-700">Asignado: {formatBOB(8500.00)}</span>
            </div>
          </div>

          {/* NODO 4: EGRESOS Y COMPROBANTES */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Paso 4: Ejecución Real</span>
            <h3 className="font-bold text-xs text-emerald-900">Gastos con Comprobante</h3>
            <p className="text-[11px] text-emerald-700">2 facturas verificadas en archivo</p>
            <div className="pt-2 border-t border-emerald-200">
              <span className="text-sm font-extrabold font-mono text-emerald-800">Ejecutado: {formatBOB(6200.00)}</span>
            </div>
          </div>
        </div>

        {/* Detalle de Comprobantes Vinculados */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-3">Comprobantes y Evidencias de Respaldo</h3>
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                  F
                </div>
                <div>
                  <p className="font-bold text-slate-900">Compra de Perfiles de Acero y Calaminas N° 28</p>
                  <p className="text-[11px] text-slate-500">Proveedor: "Ferretería El Tornillo S.R.L." • Factura N° 004819</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-mono font-bold text-slate-900">{formatBOB(3800.00)}</span>
                <span className="block text-[10px] text-emerald-600 font-semibold">Respaldo Digital Verificado</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                  R
                </div>
                <div>
                  <p className="font-bold text-slate-900">Mano de Obra Estructura Metálica y Soldadura</p>
                  <p className="text-[11px] text-slate-500">Maestro Soldador: Faustino Choque • Recibo Oficial con Fotocopia CI</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-mono font-bold text-slate-900">{formatBOB(2400.00)}</span>
                <span className="block text-[10px] text-emerald-600 font-semibold">Respaldo Digital Verificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

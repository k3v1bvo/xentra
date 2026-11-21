import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XentraLogo } from '../components/XentraLogo';
import { TiltCard3D } from '../components/TiltCard3D';
import { useAuthStore } from '../stores/authStore';
import { AppRole } from '@xentra/shared';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setProfile, setCurrentRole } = useAuthStore();
  const [email, setEmail] = useState('marina.tesoreria@xentra.app');
  const [password, setPassword] = useState('xentra2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', email });
    setProfile({
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      first_name: 'Marina',
      last_name: 'Condori Rocha',
      ci_number: '6398412',
      ci_extension: 'CBBA',
      phone: '73456789',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setCurrentRole('tesorero');
    navigate('/admin');
  };

  const handleQuickDemo = (role: AppRole, name: string, ci: string) => {
    setUser({ id: `demo-${role}`, email: `${role}@xentra.app` });
    setProfile({
      id: `demo-${role}`,
      first_name: name.split(' ')[0],
      last_name: name.split(' ').slice(1).join(' '),
      ci_number: ci,
      ci_extension: 'CBBA',
      phone: '70000000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setCurrentRole(role);
    if (role === 'vecino') {
      navigate('/vecino');
    } else if (role === 'superadmin') {
      navigate('/superadmin');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Resplandor ambiental 3D */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <TiltCard3D intensity={8} className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
          <div className="text-center space-y-2">
            <XentraLogo size="lg" className="justify-center" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 pt-2">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-slate-500">
              Ingresa a la plataforma de gestión financiera de tu OTB
            </p>
          </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            Ingresar al Sistema <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Acceso Rápido Demo para Evaluación Inmediata */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 mb-2.5 text-center uppercase tracking-wider">
            Acceso Rápido por Rol (Entorno Demo)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemo('tesorero', 'Marina Condori', '6398412')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors"
            >
              <strong className="block text-slate-900">Tesorero</strong>
              <span className="text-[10px] text-slate-500">Cobranzas y Cajas</span>
            </button>
            <button
              onClick={() => handleQuickDemo('presidente', 'Roberto Fernández', '5289341')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors"
            >
              <strong className="block text-slate-900">Presidente</strong>
              <span className="text-[10px] text-slate-500">Proyectos y VOTA</span>
            </button>
            <button
              onClick={() => handleQuickDemo('fiscalizador', 'Carlos Mamani', '4589210')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors"
            >
              <strong className="block text-slate-900">Fiscalizador</strong>
              <span className="text-[10px] text-slate-500">AI Auditor & TRACE</span>
            </button>
            <button
              onClick={() => handleQuickDemo('vecino', 'Juan José Flores', '7412589')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors"
            >
              <strong className="block text-emerald-800">Vecino</strong>
              <span className="text-[10px] text-slate-500">Portal & Recibos QR</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
            >
              ← Volver a la Portada Principal
            </button>
          </div>
        </div>
      </TiltCard3D>
    </div>
  </div>
);
};

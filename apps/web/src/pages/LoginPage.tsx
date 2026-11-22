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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail.includes('vecino')) {
      setUser({ id: 'demo-vecino', email: cleanEmail });
      setProfile({
        id: 'demo-vecino',
        first_name: 'Juan José',
        last_name: 'Flores Morales',
        ci_number: '7412589',
        ci_extension: 'CBBA',
        phone: '70000000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('vecino');
      navigate('/vecino');
      return;
    }

    if (cleanEmail.includes('superadmin')) {
      setUser({ id: 'demo-superadmin', email: cleanEmail });
      setProfile({
        id: 'demo-superadmin',
        first_name: 'Administrador',
        last_name: 'Departamental',
        ci_number: '1234567',
        ci_extension: 'CBBA',
        phone: '70000000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('superadmin');
      navigate('/superadmin');
      return;
    }

    if (cleanEmail.includes('presidente')) {
      setUser({ id: 'demo-presidente', email: cleanEmail });
      setProfile({
        id: 'demo-presidente',
        first_name: 'Roberto',
        last_name: 'Gutiérrez Vargas',
        ci_number: '5289341',
        ci_extension: 'CBBA',
        phone: '70000000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setCurrentRole('presidente');
      navigate('/admin');
      return;
    }

    // Por defecto (Tesorería)
    setUser({ id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', email: cleanEmail || 'marina.tesoreria@xentra.app' });
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

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Resplandor ambiental 3D */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 px-2 sm:px-0">
        <TiltCard3D intensity={5} className="w-full bg-[#0B132B]/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border-2 border-slate-700/80 text-white">
          <div className="text-center space-y-2">
            <XentraLogo size="lg" variant="light" className="justify-center" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white pt-2">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-slate-300">
              Ingresa a la plataforma de gestión financiera de tu OTB
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-200 block mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#030712] border-2 border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 font-medium text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3.5 bg-[#030712] border-2 border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 font-medium text-white text-base min-h-[52px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[54px] py-3.5 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-base"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Nota Informativa sobre Credenciales de Acceso */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#030712] border border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Acceso Seguro y Aislamiento Multi-Tenant</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Cada cuenta accede estrictamente a la información de su OTB. Si eres socio, solicita tus credenciales a la Directiva de tu barrio.
              </p>
              <div className="pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono space-y-0.5">
                <p>• Tesorería: <span className="text-blue-300">tesorero@xentra.app</span> (Clave: <span className="text-slate-300">xentra2026</span>)</p>
                <p>• Vecino: <span className="text-emerald-300">vecino@xentra.app</span> (Clave: <span className="text-slate-300">xentra2026</span>)</p>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs font-bold text-slate-400 hover:text-white hover:underline cursor-pointer transition-colors"
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

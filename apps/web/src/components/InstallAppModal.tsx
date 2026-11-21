import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Bell,
  WifiOff,
  ShieldCheck,
  X,
  ArrowRight,
  Sparkles,
  QrCode,
  Github,
  Layers,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'pwa' | 'apk' | 'qr'>('pwa');
  const [installedNotice, setInstalledNotice] = useState(false);
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL('https://xentra-two.vercel.app/', {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: {
          dark: '#020617',
          light: '#FFFFFF'
        }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Error generating App QR', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallPwa = () => {
    const deferredPrompt = (window as any).deferredInstallPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        (window as any).deferredInstallPrompt = null;
        setInstalledNotice(true);
      });
    } else {
      setInstalledNotice(true);
      setTimeout(() => setInstalledNotice(false), 4500);
    }
  };

  const handleDownloadApk = () => {
    setDownloadingApk(true);
    const releaseApkUrl = 'https://github.com/k3v1bvo/xentra/releases/download/v3.0.0/xentra-otb-v3.0.apk';
    const releasePageUrl = 'https://github.com/k3v1bvo/xentra/releases/latest';

    setTimeout(() => {
      // Disparar la descarga directa del paquete APK oficial compilado en GitHub Actions
      const link = document.createElement('a');
      link.href = releaseApkUrl;
      link.download = 'xentra-otb-v3.0.apk';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadingApk(false);
      setApkDownloaded(true);
      setTimeout(() => setApkDownloaded(false), 5000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B132B] border-2 border-blue-500/60 text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-500/40">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Aplicación Móvil Oficial • Android & PWA</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Lleva XENTRA OTB en tu Teléfono Móvil
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Diseñado para vecinos y adultos: acceso en 1 toque, sin contraseñas difíciles y con avisos en vivo.
            </p>
          </div>

          {/* Selector de Pestañas */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#020617] rounded-2xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setTab('pwa')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'pwa'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Instalar PWA</span>
            </button>
            <button
              onClick={() => setTab('apk')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'apk'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Bajar APK</span>
            </button>
            <button
              onClick={() => setTab('qr')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'qr'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Escanear QR</span>
            </button>
          </div>

          {/* TAB 1: PWA (Instantánea en pantalla de inicio) */}
          {tab === 'pwa' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-2xl bg-[#030712] border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white block font-bold">Avisos y Convocatorias al Instante</strong>
                    <span className="text-slate-300 text-[11px]">Recibe alertas de asambleas, cortes de agua y confirmación de tus recibos.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#030712] border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white block font-bold">Funciona sin Gastar Megas (Offline)</strong>
                    <span className="text-slate-300 text-[11px]">Consulta tus cuotas y recibos guardados en DexieDB aun sin internet.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#030712] border border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white block font-bold">Botón de Auxilio 110 Siempre a Mano</strong>
                    <span className="text-slate-300 text-[11px]">Acceso a números de auxilio y reporte de personas en la cancha o postes quemados.</span>
                  </div>
                </div>
              </div>

              {installedNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-xs text-emerald-300 text-center font-bold">
                  ✓ En Chrome/Edge, toca el botón de 3 puntos (⋮) arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla principal"</strong>.
                </div>
              )}

              <button
                onClick={handleInstallPwa}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instalar en Pantalla de Inicio (Recomendado)</span>
              </button>
            </div>
          )}

          {/* TAB 2: Descarga APK Directo (Android Standalone) */}
          {tab === 'apk' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#030712] border border-slate-700 text-xs text-slate-300 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Compilador Oficial en la Nube (GitHub Actions)</span>
                </div>
                <p className="leading-relaxed">
                  El paquete binario <code className="text-blue-300 font-mono font-bold">xentra-otb-v3.0.apk</code> se compila con el toolchain nativo de Android y Gradle 8.10 en los servidores de GitHub Actions, sin usar memoria de tu dispositivo.
                </p>

                {/* Guía Xiaomi / Android */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-[11px] space-y-1 text-slate-200">
                  <strong className="text-blue-300 block font-bold">
                    📱 Instrucciones para teléfonos Xiaomi (MIUI / HyperOS), Samsung y Android:
                  </strong>
                  <p>1. Toca <strong>"Descargar xentra-otb-v3.0.apk"</strong>.</p>
                  <p>2. Si el navegador pregunta <em>"¿Descargar archivo de todos modos?"</em>, confirma la descarga.</p>
                  <p>3. Abre el archivo y en la pantalla de análisis de Xiaomi pulsa <strong>"Instalar de todas formas"</strong>.</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Arquitectura: Universal (ARM64 / v7a)</span>
                  <span className="text-emerald-400 font-bold">Compatible con Android 8+</span>
                </div>
              </div>

              {apkDownloaded && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-xs text-emerald-300 text-center font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Descarga iniciada desde GitHub Releases! Abre la notificación en tu celular para instalar.</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={handleDownloadApk}
                  disabled={downloadingApk}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{downloadingApk ? 'Conectando con GitHub Releases...' : 'Descargar xentra-otb-v3.0.apk (Directo)'}</span>
                </button>

                <a
                  href="https://github.com/k3v1bvo/xentra/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Ver Todos los Releases & Changelog en GitHub</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: QR Real y Escaneable para Celular */}
          {tab === 'qr' && (
            <div className="space-y-3 text-center animate-in fade-in duration-200">
              <p className="text-xs text-slate-300">
                Apunta la cámara de tu teléfono móvil a este código para abrir la app al instante:
              </p>

              <div className="p-3 bg-white rounded-2xl inline-block shadow-lg mx-auto border-2 border-blue-400">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Código QR de Acceso Móvil"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                    <QrCode className="w-16 h-16 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="text-xs font-mono font-bold text-blue-300">
                https://xentra-two.vercel.app/
              </div>
              <p className="text-[11px] text-slate-400">
                Escanea con la app de Cámara o Google Lens de tu celular para abrir directamente el portal comunitario.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

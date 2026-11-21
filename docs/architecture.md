# ARQUITECTURA TÉCNICA — XENTRA OTB V3.0

## 1. Visión General
XENTRA OTB es una plataforma multi-tenant SaaS concebida como solución integral para la digitalización y transparencia de los recursos financieros en Organizaciones Territoriales de Base (OTB) de Bolivia.

## 2. Componentes del Ecosistema
1. **Frontend Web (`apps/web`)**:
   - React 18/19, TypeScript, Vite, Tailwind CSS.
   - PWA con Service Worker y persistencia local IndexedDB vía Dexie.js.
   - Zustand para gestión de estado (auth, tenant, notifications).
   - TanStack React Query para caché y sincronización reactiva.
2. **Aplicación Móvil (`apps/mobile`)**:
   - React Native con Expo SDK 52 y Expo Router.
   - Expo SQLite para persistencia offline y cola de transacciones.
   - Expo Notifications para notificaciones push en Android/iOS.
3. **Paquete Compartido (`packages/shared`)**:
   - Modelos de dominio y tipos TypeScript puros.
   - Validaciones con Zod.
   - Lógica de negocio (amortización cronológica, fórmulas de deuda, grafo TRACE, reglas deterministas de auditoría).
   - Utilidades de moneda boliviana (BOB / Bs.) y generadores criptográficos.
4. **Motor de Sincronización (`packages/sync-engine`)**:
   - Gestor de colas de operaciones offline con garantía de idempotencia.
   - Adaptador desacoplado para IndexedDB y SQLite.
5. **Backend Supabase (PostgreSQL 17)**:
   - Esquema relacional con 40+ tablas y claves foráneas estrictas.
   - Row Level Security (RLS) habilitado en el 100% de las tablas.
   - Triggers de inmutabilidad financiera y Transactional Outbox.
   - Supabase Realtime para notificaciones y actualización de saldos.
   - Edge Functions para procesamiento asíncrono y verificación pública de recibos.

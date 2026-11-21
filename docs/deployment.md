# GUÍA DE DESPLIEGUE Y OPERACIÓN — XENTRA OTB

## 1. Variables de Entorno
Configurar las variables según `.env.example`:
- `VITE_SUPABASE_URL`: Endpoint de Supabase.
- `VITE_SUPABASE_ANON_KEY`: Clave pública anon para clientes.
- `SUPABASE_SERVICE_ROLE_KEY`: Clave para Edge Functions del servidor.
- `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY`: Web Push.
- `EXPO_ACCESS_TOKEN`: Expo Push Notifications.

## 2. Despliegue en Vercel (Web Frontend)
```bash
vercel --prod
```
- Marco: Vite / React
- Directorio raíz: `apps/web`
- Comando de compilación: `pnpm build`
- Directorio de salida: `dist`

## 3. Despliegue de Base de Datos y Edge Functions en Supabase
```bash
# Migraciones
supabase db push

# Edge Functions
supabase functions deploy dispatch-notifications
supabase functions deploy verify-payment-receipt
supabase functions deploy run-financial-audit
```

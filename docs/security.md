# SEGURIDAD Y POLÍTICAS RLS — XENTRA OTB

## 1. Principios de Seguridad
- RLS activado en todas las tablas expuestas.
- Ninguna decisión de autorización depende de filtros del cliente.
- Las claves `service_role` o secretas operan exclusivamente en Supabase Edge Functions.

## 2. Funciones de Seguridad en Base de Datos
- `is_platform_admin()`: Valida pertenencia del `auth.uid()` en `platform_admins`.
- `has_otb_role(otb_id, roles)`: Valida membresía activa con rol en la OTB.
- `is_otb_member(otb_id)`: Valida pertenencia activa en la OTB.

## 3. Privacidad Estricta de Datos Financieros
- Un vecino solo puede consultar sus propias cuotas, deudas y comprobantes privados.
- La pantalla pública de verificación QR (`/verificar-recibo`) jamás expone nombres completos, números de cédula, direcciones privadas ni datos bancarios.

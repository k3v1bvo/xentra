# MODELO DE BASE DE DATOS — XENTRA OTB

## 1. Estándares de Integridad
- **Moneda Base**: Bolivianos (BOB / Bs.) en `NUMERIC(14, 2)`. Cero floats.
- **Inmutabilidad de Transacciones**: Disparador `check_payment_immutability()` que bloquea `DELETE` en pagos confirmados. Las correcciones se realizan como reversiones (`Reversed`).
- **Aislamiento Multi-OTB**: Cada tabla de negocio incluye clave foránea `otb_id UUID REFERENCES otbs(id) ON DELETE CASCADE`.

## 2. Dominios y Tablas Principales
- **Plataforma**: `profiles`, `platform_admins`, `otbs`, `otb_members`, `otb_requests`, `otb_invitations`, `otb_settings`.
- **Comunidad**: `houses`, `house_residents`, `member_join_requests`.
- **Finanzas**: `fees`, `fee_assignments`, `financial_accounts`, `payments`, `payment_allocations`, `expenses`, `expense_categories`, `cash_register_closures`, `journal_entries`, `journal_lines`.
- **Fondos y TRACE**: `community_funds`, `fund_contributions`, `projects`, `project_fund_allocations`, `public_trace_publications`.
- **AI Auditor & VOTA**: `audit_rule_configs`, `financial_audit_runs`, `financial_alerts`, `alert_resolutions`, `ai_audit_reports`, `voting_polls`, `voting_options`, `voting_eligibility`, `votes`.
- **QR & Notificaciones**: `payment_receipts`, `receipt_verification_logs`, `notifications`, `notification_preferences`, `notification_outbox`, `notification_deliveries`, `device_push_tokens`.
- **Offline & Auditoría**: `sync_operations`, `operation_conflicts`, `audit_logs`, `devices`.

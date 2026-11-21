import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';

export default function NeighborHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
    >
      {/* Offline banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 Modo Sin Conexión — Datos almacenados localmente</Text>
        </View>
      )}

      {/* Neighbor & House Info */}
      <View style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>OTB Villa Esperanza</Text>
          </View>
          <View style={[styles.badge, styles.statusBadge]}>
            <Text style={styles.statusBadgeText}>Al Día</Text>
          </View>
        </View>
        <Text style={styles.greeting}>Hola, Juan Pérez</Text>
        <Text style={styles.houseDetails}>Lote #12 — Manzano 4, Calle Las Retamas</Text>
        <Text style={styles.ciDetails}>C.I. 6849201 CBBA</Text>
      </View>

      {/* Debt & Financial Summary */}
      <View style={styles.balanceGrid}>
        <View style={[styles.balanceCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.balanceLabel}>Deuda Pendiente</Text>
          <Text style={styles.balanceAmount}>Bs. 0,00</Text>
          <Text style={styles.balanceSub}>Sin cuotas vencidas</Text>
        </View>
        <View style={[styles.balanceCard, { borderLeftColor: '#3B82F6' }]}>
          <Text style={styles.balanceLabel}>Aportes 2026</Text>
          <Text style={styles.balanceAmount}>Bs. 350,00</Text>
          <Text style={styles.balanceSub}>7 cuotas cubiertas</Text>
        </View>
      </View>

      {/* Proximas Cuotas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximas Obligaciones</Text>

        <View style={styles.feeItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.feeTitle}>Cuota Ordinaria Mayo 2026</Text>
            <Text style={styles.feeDate}>Vence: 10 de Mayo, 2026</Text>
            <Text style={styles.feeCategory}>Mantenimiento y Alumbrado Público</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.feeAmount}>Bs. 50,00</Text>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pagar QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.feeItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.feeTitle}>Aporte Pro-Cámaras Fase 2</Text>
            <Text style={styles.feeDate}>Vence: 25 de Mayo, 2026</Text>
            <Text style={styles.feeCategory}>Proyecto de Seguridad Vecinal</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.feeAmount}>Bs. 100,00</Text>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pagar QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Info Bancaria de la OTB */}
      <View style={styles.bankCard}>
        <Text style={styles.bankTitle}>🏛️ Datos Bancarios OTB Villa Esperanza</Text>
        <Text style={styles.bankDetail}>Banco: Banco Unión S.A.</Text>
        <Text style={styles.bankDetail}>N° Cuenta: 10000034891230 (Bs.)</Text>
        <Text style={styles.bankDetail}>Titular: OTB Villa Esperanza / Directiva</Text>
        <Text style={styles.bankTip}>Al realizar transferencias, registra tu comprobante en la pestaña Pagos.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16,
  },
  offlineBanner: {
    backgroundColor: '#B45309',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  offlineText: {
    color: '#FEF3C7',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  houseDetails: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 2,
  },
  ciDetails: {
    fontSize: 12,
    color: '#64748B',
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSub: {
    fontSize: 11,
    color: '#64748B',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  feeItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  feeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  feeDate: {
    fontSize: 12,
    color: '#F59E0B',
    marginBottom: 2,
  },
  feeCategory: {
    fontSize: 11,
    color: '#64748B',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  payButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bankCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 40,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#93C5FD',
    marginBottom: 8,
  },
  bankDetail: {
    fontSize: 12,
    color: '#CBD5E1',
    marginBottom: 4,
  },
  bankTip: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

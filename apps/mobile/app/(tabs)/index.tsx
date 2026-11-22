import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Linking, Alert, Platform } from 'react-native';

export default function NeighborHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleCallEmergency = (phone: string, service: string) => {
    Alert.alert(
      `Llamar a ${service}`,
      `¿Deseas marcar al número de emergencia oficial ${phone}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar Ahora', onPress: () => Linking.openURL(`tel:${phone}`) }
      ]
    );
  };

  const handleQuickReport = (incident: string) => {
    Alert.alert(
      'Alerta Vecinal Transmitida',
      `Se ha enviado el aviso "${incident}" a la directiva y comisión de vigilancia de Villa Esperanza.`,
      [{ text: 'Entendido' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
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
            <Text style={styles.statusBadgeText}>✓ Al Día</Text>
          </View>
        </View>
        <Text style={styles.greeting}>Hola, Juan José Flores</Text>
        <Text style={styles.houseDetails}>Manzana A, Lote 12 — Calle Las Retamas</Text>
        <Text style={styles.ciDetails}>C.I. 7412589 CBBA • Código de Socio: SOC-012</Text>
      </View>

      {/* Centro de Auxilio y Emergencias 24/7 (Botones Grandes y Claros) */}
      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>🚨 Centro de Auxilio Inmediato OTB</Text>
        <Text style={styles.emergencySubtitle}>
          Llamada rápida y directa a los servicios de emergencia de Bolivia:
        </Text>

        <View style={styles.emergencyButtonsRow}>
          <TouchableOpacity
            style={[styles.emergencyBtn, { backgroundColor: '#DC2626' }]}
            onPress={() => handleCallEmergency('110', 'Radio Patrullas 110')}
            activeOpacity={0.8}
          >
            <Text style={styles.emergencyBtnIcon}>👮</Text>
            <Text style={styles.emergencyBtnText}>Pol. 110</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.emergencyBtn, { backgroundColor: '#059669' }]}
            onPress={() => handleCallEmergency('165', 'SAMU Ambulancia 165')}
            activeOpacity={0.8}
          >
            <Text style={styles.emergencyBtnIcon}>🚑</Text>
            <Text style={styles.emergencyBtnText}>SAMU 165</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.emergencyBtn, { backgroundColor: '#D97706' }]}
            onPress={() => handleCallEmergency('119', 'Bomberos 119')}
            activeOpacity={0.8}
          >
            <Text style={styles.emergencyBtnIcon}>🚒</Text>
            <Text style={styles.emergencyBtnText}>Bomb. 119</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickReportsRow}>
          <Text style={styles.quickReportsTitle}>Avisos Rápidos a la Ronda Comunal:</Text>
          <View style={styles.chipGrid}>
            <TouchableOpacity
              style={styles.reportChip}
              onPress={() => handleQuickReport('Persona consumiendo alcohol en la cancha')}
              activeOpacity={0.7}
            >
              <Text style={styles.reportChipText}>🍺 Cancha / Ebrios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportChip}
              onPress={() => handleQuickReport('Mascota extraviada o en peligro')}
              activeOpacity={0.7}
            >
              <Text style={styles.reportChipText}>🐕 Mascota / Peligro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportChip}
              onPress={() => handleQuickReport('Fuga de agua potable o matriz rota')}
              activeOpacity={0.7}
            >
              <Text style={styles.reportChipText}>💧 Fuga de Agua</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportChip}
              onPress={() => handleQuickReport('Luminaria pública apagada o quemada')}
              activeOpacity={0.7}
            >
              <Text style={styles.reportChipText}>💡 Luz Quemada</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Debt & Financial Summary */}
      <View style={styles.balanceGrid}>
        <View style={[styles.balanceCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.balanceLabel}>Deuda Pendiente</Text>
          <Text style={styles.balanceAmount}>Bs. 0,00</Text>
          <Text style={styles.balanceSub}>Sin cuotas vencidas</Text>
        </View>
        <View style={[styles.balanceCard, { borderLeftColor: '#3B82F6' }]}>
          <Text style={styles.balanceLabel}>Aportes Gestión</Text>
          <Text style={styles.balanceAmount}>Bs. 350,00</Text>
          <Text style={styles.balanceSub}>7 cuotas acreditadas</Text>
        </View>
      </View>

      {/* Proximas Cuotas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Obligaciones Comunitarias</Text>

        <View style={styles.feeItem}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.feeTitle}>Cuota Ordinaria Noviembre 2026</Text>
            <Text style={styles.feeDate}>Vence: 30 de Noviembre, 2026</Text>
            <Text style={styles.feeCategory}>Mantenimiento y Alumbrado Público</Text>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={styles.feeAmount}>Bs. 25,00</Text>
            <TouchableOpacity
              style={styles.payButton}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Pago QR', 'Abre la pestaña "Pagos" para ver el código QR y subir tu comprobante.')}
            >
              <Text style={styles.payButtonText}>Pagar QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.feeItem}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.feeTitle}>Aporte Pro-Tinglado Cancha (Cuota 1 de 2)</Text>
            <Text style={styles.feeDate}>Vence: 15 de Noviembre, 2026</Text>
            <Text style={styles.feeCategory}>Proyecto Comunitario Aprobado en Asamblea</Text>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={styles.feeAmount}>Bs. 100,00</Text>
            <TouchableOpacity
              style={styles.payButton}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Pago QR', 'Abre la pestaña "Pagos" para ver el código QR y subir tu comprobante.')}
            >
              <Text style={styles.payButtonText}>Pagar QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Info Bancaria de la OTB */}
      <View style={styles.bankCard}>
        <Text style={styles.bankTitle}>🏛️ Datos Oficiales de Depósito Bancario</Text>
        <Text style={styles.bankDetail}>Entidad: Banco Unión S.A.</Text>
        <Text style={styles.bankDetail}>Cuenta Corriente: 10000034891230 (Bs.)</Text>
        <Text style={styles.bankDetail}>Titular: OTB Villa Esperanza / Mesa Directiva</Text>
        <Text style={styles.bankTip}>
          Nota: Si pagas por transferencia o QR bancario, adjunta la captura en la pestaña "Pagos".
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110, // Espacio amplio para evitar que la barra de navegación tape los botones
  },
  offlineBanner: {
    backgroundColor: '#B45309',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  offlineText: {
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  badgeText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  statusBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '900',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  houseDetails: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: 4,
  },
  ciDetails: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emergencyCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    marginBottom: 18,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FCA5A5',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  emergencyButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  emergencyBtn: {
    flex: 1,
    minHeight: 60, // WeChat Senior & ELDER Standard: 60px
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyBtnIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  emergencyBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  quickReportsRow: {
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(239, 68, 68, 0.4)',
    paddingTop: 14,
  },
  quickReportsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FECACA',
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reportChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56, // WCAG AAA & ELDER Target Size: ≥ 56px
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#64748B',
    justifyContent: 'center',
  },
  reportChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    borderLeftWidth: 5,
    borderWidth: 1.5,
    borderColor: '#475569',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '800',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  balanceSub: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  feeItem: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#475569',
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 22,
  },
  feeDate: {
    fontSize: 14,
    color: '#FBBF24',
    fontWeight: '800',
    marginBottom: 4,
  },
  feeCategory: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#34D399',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#2563EB',
    minHeight: 56, // WeChat Senior & ELDER Standard: 56-60px
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  bankCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#93C5FD',
    marginBottom: 8,
  },
  bankDetail: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 4,
    fontWeight: '600',
  },
  bankTip: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

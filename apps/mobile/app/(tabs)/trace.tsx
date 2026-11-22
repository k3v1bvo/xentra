import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NeighborTraceScreen() {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: '#0B132B' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>XENTRA TRACE — Trazabilidad Contable</Text>
        <Text style={styles.bannerSub}>
          Grafo verificado de fondos comunales: Cada boliviano recaudado tiene asignación clara y comprobante digital auditado.
        </Text>
      </View>

      {/* Resumen de Fondos */}
      <View style={styles.fundsCard}>
        <Text style={styles.sectionHeader}>Fondos Comunitarios Oficiales (OTB Villa Esperanza)</Text>

        <View style={styles.fundRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fundName}>Fondo General / Caja Central</Text>
            <Text style={styles.fundType}>Operaciones corrientes y mantenimiento</Text>
          </View>
          <Text style={styles.fundBalance}>Bs. 12.450,00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.fundRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fundName}>Fondo Pro-Tinglado Cancha</Text>
            <Text style={styles.fundType}>Aportes extraordinarios específicos</Text>
          </View>
          <Text style={styles.fundBalance}>Bs. 8.500,00</Text>
        </View>
      </View>

      {/* Timeline de Ejecución Real */}
      <Text style={styles.sectionHeader}>Últimos Gastos Ejecutados con Comprobante</Text>

      <View style={styles.timelineItem}>
        <View style={styles.dot} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Compra de Perfiles de Acero y Calaminas</Text>
            <Text style={styles.itemAmount}>Bs. 3.800,00</Text>
          </View>
          <Text style={styles.itemMeta}>Fondo: Pro-Tinglado • 21 de Noviembre, 2026</Text>
          <Text style={styles.itemInvoice}>Factura Comercial: F-004819 (Ferretería El Tornillo)</Text>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>✓ Comprobante Digital Verificado</Text>
          </View>
        </View>
      </View>

      <View style={styles.timelineItem}>
        <View style={styles.dot} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Mano de Obra Estructura Metálica y Soldadura</Text>
            <Text style={styles.itemAmount}>Bs. 2.400,00</Text>
          </View>
          <Text style={styles.itemMeta}>Fondo: Pro-Tinglado • 19 de Noviembre, 2026</Text>
          <Text style={styles.itemInvoice}>Recibo Oficial con Fotocopia CI (Faustino Choque)</Text>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>✓ Comprobante Digital Verificado</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110, // Evita solapamiento con la barra de navegación móvil
  },
  banner: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#60A5FA',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  fundsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  fundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fundName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fundType: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  fundBalance: {
    fontSize: 16,
    fontWeight: '900',
    color: '#34D399',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    paddingRight: 8,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#34D399',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  itemMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
  },
  itemInvoice: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: 8,
  },
  verifiedTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  verifiedTagText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '900',
  },
});

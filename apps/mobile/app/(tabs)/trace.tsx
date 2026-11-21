import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function NeighborTraceScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>XENTRA TRACE — Trazabilidad Contable</Text>
        <Text style={styles.bannerSub}>
          Grafo verificado de fondos públicos: Cada boliviano recaudado tiene asignación clara y comprobante digital auditado.
        </Text>
      </View>

      {/* Resumen de Fondos */}
      <View style={styles.fundsCard}>
        <Text style={styles.sectionHeader}>Fondos de la Comunidad (OTB Villa Esperanza)</Text>
        
        <View style={styles.fundRow}>
          <View>
            <Text style={styles.fundName}>Fondo General / Caja Central</Text>
            <Text style={styles.fundType}>Operaciones corrientes y mantenimiento</Text>
          </View>
          <Text style={styles.fundBalance}>Bs. 12.450,00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.fundRow}>
          <View>
            <Text style={styles.fundName}>Fondo Pro-Cámaras de Seguridad</Text>
            <Text style={styles.fundType}>Aportes extraordinarios específicos</Text>
          </View>
          <Text style={styles.fundBalance}>Bs. 8.200,00</Text>
        </View>
      </View>

      {/* Timeline de Ejecución Real */}
      <Text style={styles.sectionHeader}>Últimos Gastos Ejecutados con Comprobante</Text>

      <View style={styles.timelineItem}>
        <View style={styles.dot} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Compra de Cable UTP Cat6 y Conectores</Text>
            <Text style={styles.itemAmount}>Bs. 480,00</Text>
          </View>
          <Text style={styles.itemMeta}>Fondo: Cámaras de Seguridad • 18 de Abril, 2026</Text>
          <Text style={styles.itemInvoice}>Factura Comercial: F-003491 (Ferretería El Cóndor)</Text>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>✓ Comprobante Digital Auditado</Text>
          </View>
        </View>
      </View>

      <View style={styles.timelineItem}>
        <View style={styles.dot} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Pago Servicio de Desmalezado de Áreas Verdes</Text>
            <Text style={styles.itemAmount}>Bs. 350,00</Text>
          </View>
          <Text style={styles.itemMeta}>Fondo: General • 12 de Abril, 2026</Text>
          <Text style={styles.itemInvoice}>Recibo Oficial con Retención: R-0192</Text>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>✓ Comprobante Digital Auditado</Text>
          </View>
        </View>
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
  banner: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60A5FA',
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  fundsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fundType: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  fundBalance: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34D399',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
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
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F87171',
  },
  itemMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  itemInvoice: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  verifiedTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedTagText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

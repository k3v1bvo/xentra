import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default function NeighborPaymentsScreen() {
  const [activeTab, setActiveTab] = useState<'historial' | 'reportar'>('historial');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Efectivo' | 'Transferencia' | 'QR'>('Transferencia');

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'historial' && styles.tabButtonActive]}
          onPress={() => setActiveTab('historial')}
        >
          <Text style={[styles.tabText, activeTab === 'historial' && styles.tabTextActive]}>Mis Recibos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'reportar' && styles.tabButtonActive]}
          onPress={() => setActiveTab('reportar')}
        >
          <Text style={[styles.tabText, activeTab === 'reportar' && styles.tabTextActive]}>Reportar Pago</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'historial' ? (
        <ScrollView style={styles.scroll}>
          {/* Recibo verificado 1 */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptCode}>REC-VE-2026-0001</Text>
                <Text style={styles.receiptDate}>15 de Abril, 2026 — 10:24</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verificado</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Concepto:</Text>
              <Text style={styles.value}>Cuota Ordinaria Abril 2026</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Método:</Text>
              <Text style={styles.value}>Código QR BCP (Confirmado)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Importe:</Text>
              <Text style={styles.amountValue}>Bs. 50,00</Text>
            </View>

            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>TOKEN CRIPTOGRÁFICO SHA-256 (XENTRA QR):</Text>
              <Text style={styles.tokenValue}>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</Text>
            </View>
          </View>

          {/* Recibo verificado 2 */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptCode}>REC-VE-2026-0002</Text>
                <Text style={styles.receiptDate}>10 de Marzo, 2026 — 16:40</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verificado</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Concepto:</Text>
              <Text style={styles.value}>Cuota Ordinaria Marzo 2026</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Método:</Text>
              <Text style={styles.value}>Efectivo (Cobrador: Tesorería)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Importe:</Text>
              <Text style={styles.amountValue}>Bs. 50,00</Text>
            </View>

            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>TOKEN CRIPTOGRÁFICO SHA-256 (XENTRA QR):</Text>
              <Text style={styles.tokenValue}>a4f2c99182db1c248afbf3a8996eb71327ce41e4649b934ca495991b7852f102</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Registrar Comprobante de Pago</Text>
            <Text style={styles.formSubtitle}>
              Sube el comprobante de tu transferencia o pago en efectivo para validación por la tesorería.
            </Text>

            <Text style={styles.inputLabel}>Importe Pagado (en Bolivianos):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Bs. 50.00"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.inputLabel}>Método de Pago:</Text>
            <View style={styles.methodRow}>
              {(['Transferencia', 'QR', 'Efectivo'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodBtn, method === m && styles.methodBtnActive]}
                  onPress={() => setMethod(m)}
                >
                  <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>📷 Adjuntar Foto o Captura de Depósito</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Enviar para Verificación</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 6,
    margin: 16,
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  receiptCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptCode: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  receiptDate: {
    color: '#94A3B8',
    fontSize: 12,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
  },
  value: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '500',
  },
  amountValue: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenBox: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  tokenLabel: {
    color: '#64748B',
    fontSize: 9,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  tokenValue: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 6,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  methodBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  methodBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  methodText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#60A5FA',
  },
  uploadBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadBtnText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

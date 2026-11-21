import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';

export default function NeighborPaymentsScreen() {
  const [activeTab, setActiveTab] = useState<'historial' | 'reportar'>('historial');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Efectivo' | 'Transferencia' | 'QR'>('Transferencia');
  const [receiptConcept, setReceiptConcept] = useState('Cuota Ordinaria Noviembre 2026');

  const handleSubmitProof = () => {
    if (!amount) {
      Alert.alert('Monto requerido', 'Por favor ingresa el monto pagado en Bolivianos.');
      return;
    }
    Alert.alert(
      'Comprobante Enviado',
      `Tu pago de Bs. ${amount} fue enviado a la Tesorería de la OTB para conciliación y emisión de tu recibo con código QR.`,
      [{ text: 'Aceptar', onPress: () => { setAmount(''); setActiveTab('historial'); } }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher Superior */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'historial' && styles.tabButtonActive]}
          onPress={() => setActiveTab('historial')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'historial' && styles.tabTextActive]}>
            Mis Recibos Oficiales
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'reportar' && styles.tabButtonActive]}
          onPress={() => setActiveTab('reportar')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'reportar' && styles.tabTextActive]}>
            Reportar Pago
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'historial' ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Recibo verificado 1 */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptCode}>OTB-CBBA-001-2026-00042</Text>
                <Text style={styles.receiptDate}>21 de Noviembre, 2026 — 10:24</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Certificado</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Concepto Oficial:</Text>
              <Text style={styles.value}>Cuota Ordinaria Noviembre + Aporte Tinglado</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Método Registrado:</Text>
              <Text style={styles.value}>QR Simple Bancario (Banco Unión)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Importe Cancelado:</Text>
              <Text style={styles.amountValue}>Bs. 125,00</Text>
            </View>

            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>TOKEN CRIPTOGRÁFICO SHA-256 (XENTRA TRACE):</Text>
              <Text style={styles.tokenValue}>
                b8192a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef012345678
              </Text>
            </View>
          </View>

          {/* Recibo verificado 2 */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptCode}>OTB-CBBA-001-2026-00035</Text>
                <Text style={styles.receiptDate}>18 de Octubre, 2026 — 16:40</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Certificado</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Concepto Oficial:</Text>
              <Text style={styles.value}>Cuota Ordinaria Octubre 2026</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Método Registrado:</Text>
              <Text style={styles.value}>Efectivo en Sede OTB (Tesorero)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Importe Cancelado:</Text>
              <Text style={styles.amountValue}>Bs. 25,00</Text>
            </View>

            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>TOKEN CRIPTOGRÁFICO SHA-256 (XENTRA TRACE):</Text>
              <Text style={styles.tokenValue}>
                7a9f2b84c13e5d02e847192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Registrar Comprobante de Aporte</Text>
            <Text style={styles.formSubtitle}>
              Sube el comprobante de tu transferencia o pago por QR para validación por la directiva de la OTB.
            </Text>

            <Text style={styles.inputLabel}>Concepto del Aporte:</Text>
            <TextInput
              style={styles.textInput}
              value={receiptConcept}
              onChangeText={setReceiptConcept}
              placeholder="Ej. Cuota Noviembre 2026"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Importe Abonado (en Bolivianos):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. 50.00"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.inputLabel}>Método de Pago Utilizado:</Text>
            <View style={styles.methodRow}>
              {(['Transferencia', 'QR', 'Efectivo'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodBtn, method === m && styles.methodBtnActive]}
                  onPress={() => setMethod(m)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.uploadBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Comprobante', 'Foto de comprobante bancario seleccionada correctamente.')}
            >
              <Text style={styles.uploadBtnText}>📷 Adjuntar Foto o Captura de Depósito</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={handleSubmitProof}>
              <Text style={styles.submitBtnText}>Enviar Comprobante a Tesorería</Text>
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
    backgroundColor: '#0B132B',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110, // Padding amplio para que los botones nunca queden tapados
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 6,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabButton: {
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  receiptCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptCode: {
    fontSize: 14,
    fontWeight: '900',
    color: '#93C5FD',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  receiptDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  verifiedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  value: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  amountValue: {
    fontSize: 16,
    color: '#34D399',
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tokenBox: {
    marginTop: 10,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tokenLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#60A5FA',
    marginBottom: 2,
  },
  tokenValue: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#CBD5E1',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 16,
    minHeight: 50,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  methodBtn: {
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
  },
  methodBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },
  methodText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  methodTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  uploadBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  uploadBtnText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    minHeight: 54, // Botón grande táctil para personas mayores
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

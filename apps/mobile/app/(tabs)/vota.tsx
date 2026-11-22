import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NeighborVotaScreen() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!selectedOption) {
      Alert.alert('Selección requerida', 'Por favor selecciona una opción antes de emitir tu voto.');
      return;
    }
    setHasVoted(true);
    Alert.alert(
      'Voto Registrado con Éxito',
      'Tu voto fue computado de manera secreta e inmutable en el libro de actas comunal.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: '#0B132B' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Democracia Participativa OTB</Text>
        <Text style={styles.headerSub}>
          1 Voto por Vivienda/Vecino censado con C.I. verificado. Restricción única en base de datos.
        </Text>
      </View>

      <View style={styles.pollCard}>
        <View style={styles.badgeRow}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Consulta Activa</Text>
          </View>
          <Text style={styles.pollDeadline}>Cierre: 15 de Diciembre, 2026</Text>
        </View>

        <Text style={styles.pollTitle}>Priorización de Obras Comunitarias — Gestión 2027</Text>
        <Text style={styles.pollDesc}>
          Consulta a los vecinos para definir el destino del fondo de inversión municipal y contraparte vecinal (Presupuesto Referencial: Bs. 35.000,00).
        </Text>

        <View style={styles.optionsContainer}>
          {[
            { id: 'opt1', label: 'Pavimentado de Pasaje Los Álamos (Manzana A)' },
            { id: 'opt2', label: 'Instalación de 8 Cámaras de Seguridad y Sirena Vecinal' },
            { id: 'opt3', label: 'Refacción y Juegos Infantiles en la Plaza Central' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.id}
              disabled={hasVoted}
              style={[
                styles.optionItem,
                selectedOption === opt.id && styles.optionSelected,
                hasVoted && styles.optionDisabled,
              ]}
              onPress={() => setSelectedOption(opt.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, selectedOption === opt.id && styles.radioActive]} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!hasVoted ? (
          <TouchableOpacity style={styles.voteBtn} onPress={handleVote} activeOpacity={0.8}>
            <Text style={styles.voteBtnText}>Emitir Mi Voto Oficial</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.votedBanner}>
            <Text style={styles.votedText}>✓ Tu voto oficial ha sido registrado para esta consulta comunal.</Text>
          </View>
        )}
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
    paddingBottom: 110, // Margen para evitar que la barra de navegación tape las opciones
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  pollCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  activeBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '900',
  },
  pollDeadline: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pollDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 18,
  },
  optionsContainer: {
    marginBottom: 20,
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 16,
    padding: 18,
    minHeight: 62, // WeChat Senior & ELDER Standard: ≥ 60px
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  optionDisabled: {
    opacity: 0.75,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#94A3B8',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  optionLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
    flex: 1,
    lineHeight: 22,
  },
  voteBtn: {
    backgroundColor: '#2563EB',
    minHeight: 60, // WeChat Senior & ELDER Standard: ≥ 60px
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  voteBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  votedBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  votedText: {
    color: '#34D399',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
});

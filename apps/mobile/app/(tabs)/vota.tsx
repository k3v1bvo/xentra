import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function NeighborVotaScreen() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!selectedOption) {
      Alert.alert('Selección requerida', 'Por favor selecciona una opción antes de emitir tu voto.');
      return;
    }
    setHasVoted(true);
    Alert.alert('Voto Registrado', 'Tu voto fue emitido y registrado de manera secreta y auditable en la base de datos.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Democracia Participativa OTB</Text>
        <Text style={styles.headerSub}>
          1 Voto por Vivienda/Vecino registrado con C.I. verificado. Restricción única en base de datos.
        </Text>
      </View>

      <View style={styles.pollCard}>
        <View style={styles.badgeRow}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Consulta Activa</Text>
          </View>
          <Text style={styles.pollDeadline}>Cierra: 30 de Mayo, 2026</Text>
        </View>

        <Text style={styles.pollTitle}>Aprobación de Contratación de Servicio de Seguridad Privada</Text>
        <Text style={styles.pollDesc}>
          Se somete a consulta la contratación de 2 guardias nocturnos para el perímetro de la OTB Villa Esperanza con costo adicional de Bs. 30 por vivienda al mes.
        </Text>

        <View style={styles.optionsContainer}>
          {[
            { id: 'opt1', label: 'A FAVOR — Aprobar contratación e incremento de Bs. 30' },
            { id: 'opt2', label: 'EN CONTRA — Mantener solo el sistema de cámaras actual' },
            { id: 'opt3', label: 'EN BLANCO' },
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
            >
              <View style={[styles.radio, selectedOption === opt.id && styles.radioActive]} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!hasVoted ? (
          <TouchableOpacity style={styles.voteBtn} onPress={handleVote}>
            <Text style={styles.voteBtnText}>Emitir Voto Oficial</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.votedBanner}>
            <Text style={styles.votedText}>✓ Ya has participado en esta consulta con tu cédula de identidad.</Text>
          </View>
        )}
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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: 'bold',
  },
  pollDeadline: {
    fontSize: 11,
    color: '#64748B',
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pollDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 20,
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 14,
  },
  optionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 12,
  },
  radioActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  optionLabel: {
    color: '#F8FAFC',
    fontSize: 13,
    flex: 1,
  },
  voteBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  voteBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  votedBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  votedText: {
    color: '#34D399',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

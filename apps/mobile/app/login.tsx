import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function MobileLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('juan.vecino@xentra.app');
  const [password, setPassword] = useState('xentra2026');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 600);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>X</Text>
        </View>
        <Text style={styles.title}>XENTRA OTB</Text>
        <Text style={styles.subtitle}>Tu comunidad, en orden. Tu gestión, transparente.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.loginTitle}>Iniciar Sesión</Text>
        <Text style={styles.loginDesc}>Accede con tu correo o número de C.I. registrado</Text>

        <Text style={styles.label}>Correo Electrónico o C.I.:</Text>
        <TextInput
          style={styles.input}
          placeholder="ej. juan.vecino@xentra.app"
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Verificando...' : 'Entrar a mi OTB'}</Text>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Credenciales Demo:</Text>
          <Text style={styles.demoText}>Vecino: juan.vecino@xentra.app / xentra2026</Text>
          <Text style={styles.demoText}>Directiva: roberto.presidencia@xentra.app</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    padding: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  loginDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});

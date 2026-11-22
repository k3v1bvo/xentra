import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo e Identidad Comunal */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>X</Text>
            </View>
            <Text style={styles.title}>XENTRA OTB</Text>
            <Text style={styles.subtitle}>Gestión Financiera & Democracia Vecinal</Text>
          </View>

          {/* Tarjeta de Inicio de Sesión */}
          <View style={styles.formCard}>
            <Text style={styles.loginTitle}>Iniciar Sesión</Text>
            <Text style={styles.loginDesc}>
              Accede a la plataforma de tu comunidad barrial
            </Text>

            <Text style={styles.label}>Correo Electrónico o C.I.:</Text>
            <TextInput
              style={styles.input}
              placeholder="ej. juan.vecino@xentra.app"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Contraseña Asignada:</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verificando...' : 'Entrar a mi OTB'}
              </Text>
            </TouchableOpacity>

            {/* Aviso de Seguridad y Credenciales */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>🔒 Acceso Seguro y Aislamiento de Datos:</Text>
              <Text style={styles.demoText}>• Vecino: juan.vecino@xentra.app / xentra2026</Text>
              <Text style={styles.demoText}>• Mesa Directiva: roberto.presidencia@xentra.app</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 32,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#60A5FA',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  loginDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    color: '#E2E8F0',
    marginBottom: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 18,
    minHeight: 54, // Target táctil accesible
  },
  button: {
    backgroundColor: '#2563EB',
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  demoBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#60A5FA',
    marginBottom: 6,
  },
  demoText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 18,
    fontWeight: '500',
  },
});

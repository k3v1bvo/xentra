import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0B132B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 17,
        },
        tabBarStyle: {
          backgroundColor: '#0B132B',
          borderTopColor: '#1E293B',
          borderTopWidth: 1.5,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 26 : 12,
          paddingTop: 8,
          elevation: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mis Cuotas',
          tabBarLabel: 'Inicio',
          headerTitle: 'XENTRA OTB — Mi Portal',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Text style={styles.iconEmoji}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pagos"
        options={{
          title: 'Mis Pagos',
          tabBarLabel: 'Pagos',
          headerTitle: 'Historial de Pagos y Recibos',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Text style={styles.iconEmoji}>💳</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trace"
        options={{
          title: 'Xentra TRACE',
          tabBarLabel: 'Transparencia',
          headerTitle: 'Trazabilidad de Fondos',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Text style={styles.iconEmoji}>🛡️</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vota"
        options={{
          title: 'Xentra VOTA',
          tabBarLabel: 'Votaciones',
          headerTitle: 'Consultas Vecinales Activas',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Text style={styles.iconEmoji}>🗳️</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  iconEmoji: {
    fontSize: 18,
  },
});

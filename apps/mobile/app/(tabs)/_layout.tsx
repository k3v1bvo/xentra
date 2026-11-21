import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';

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
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mis Cuotas',
          tabBarLabel: 'Inicio',
          headerTitle: 'XENTRA OTB — Mi Portal',
        }}
      />
      <Tabs.Screen
        name="pagos"
        options={{
          title: 'Mis Pagos',
          tabBarLabel: 'Pagos',
          headerTitle: 'Historial de Pagos y Recibos',
        }}
      />
      <Tabs.Screen
        name="trace"
        options={{
          title: 'Xentra TRACE',
          tabBarLabel: 'Transparencia',
          headerTitle: 'Trazabilidad de Fondos',
        }}
      />
      <Tabs.Screen
        name="vota"
        options={{
          title: 'Xentra VOTA',
          tabBarLabel: 'Votaciones',
          headerTitle: 'Consultas Vecinales Activas',
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0F172A',
        },
        headerTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
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

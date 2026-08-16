import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/');
      setStats(res.data);
    } catch (e) {
      console.log('Failed to fetch dashboard');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Field Overview</Text>
      
      {stats ? (
        <View style={styles.grid}>
          <View style={[styles.card, { borderLeftColor: '#10b981' }]}>
            <Text style={styles.cardTitle}>Active Licenses</Text>
            <Text style={styles.cardValue}>{stats.active_licenses}</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: '#f59e0b' }]}>
            <Text style={styles.cardTitle}>Renewal Due</Text>
            <Text style={styles.cardValue}>{stats.renewal_due}</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: '#ef4444' }]}>
            <Text style={styles.cardTitle}>Not Renewed</Text>
            <Text style={styles.cardValue}>{stats.not_renewed}</Text>
          </View>
          <View style={[styles.card, { borderLeftColor: '#3b82f6' }]}>
            <Text style={styles.cardTitle}>Age 65+ Watch</Text>
            <Text style={styles.cardValue}>{stats.age_65_reached}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.loading}>Loading data...</Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#334155',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  }
});

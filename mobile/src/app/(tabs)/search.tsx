import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // Basic search against license-holders endpoint using query param
      const res = await api.get(`/license-holders/?search=${query}`);
      setResults(res.data.results || res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.resultCard}>
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.nic}>NIC: {item.nic}</Text>
      <Text style={styles.status}>Status: {item.current_status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput 
          style={styles.input} 
          placeholder="Search by Name or NIC..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Searching...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            query ? <Text style={styles.empty}>No results found.</Text> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  searchBtn: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  nic: {
    color: '#64748b',
    marginBottom: 4,
  },
  status: {
    fontWeight: '600',
    color: '#0ea5e9',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#94a3b8',
  }
});

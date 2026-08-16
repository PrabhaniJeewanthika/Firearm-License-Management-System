import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ScannerScreen() {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    // In a real app, this would open expo-camera to scan QR/Barcodes
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      alert('Simulated Scan: 12345-ABC');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firearm / License Scanner</Text>
      <Text style={styles.subtitle}>
        Scan the official QR code or barcode on the physical license card.
      </Text>

      <View style={styles.scannerBox}>
        {scanning ? (
          <Text style={styles.scanningText}>Scanning...</Text>
        ) : (
          <MaterialCommunityIcons name="qrcode-scan" size={120} color="#cbd5e1" />
        )}
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleScan}
        disabled={scanning}
      >
        <Text style={styles.buttonText}>
          {scanning ? 'Please wait...' : 'Tap to Scan'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 48,
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    backgroundColor: 'rgba(14, 165, 233, 0.1)'
  },
  scanningText: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DataScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo à tela Data!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffde7',
  },
  text: {
    fontSize: 22,
    color: '#fbc02d',
  },
});

export default DataScreen;

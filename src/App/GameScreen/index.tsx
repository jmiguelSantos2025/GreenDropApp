import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GameScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo à tela Game!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
  },
  text: {
    fontSize: 22,
    color: '#00796b',
  },
});

export default GameScreen;

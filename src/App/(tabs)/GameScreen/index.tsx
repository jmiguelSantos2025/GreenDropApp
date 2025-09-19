import React from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';

const GameScreen = () => {
  return (
    <View style={styles.container}>
      <Button title="Introdução" />
      <Button title="Controle de Irrigação"/>
      <Button title="Dicas de Economia de agua"/>
      <Button title="Desafios ambientais"/>
      <Button title="Fase final"/>
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

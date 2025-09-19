<<<<<<<< HEAD:src/app/index.tsx
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GameScreen = () => {
  return (
    <View>
        
========
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
>>>>>>>> b7e0632cc3f78f240cedfc2212179c349538fd9e:src/App/(tabs)/GameScreen/index.tsx
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

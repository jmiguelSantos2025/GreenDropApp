import React, { useState } from "react";
import { View, Pressable, TouchableOpacity, ImageBackground, Text, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";

type Props = {
    Alternativa: string;
    Resposta: string;
    Correta?: boolean; 
    Selecionada: boolean; 
    ResultadoVisivel: boolean; 
    onPress: () => void; 
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function Alternativa({ Alternativa, Resposta, Selecionada, Correta, ResultadoVisivel, onPress }: Props) {
  
    let backgroundColor = "#41B947";

    let color = "#41B947";

    if (Selecionada && !ResultadoVisivel) {
    backgroundColor = "#E9CA00";
    color = "#E9CA00";
    }

    if (ResultadoVisivel) {
    if (Correta) backgroundColor = "#00A6E7", color = "#00A6E7"; // azul se correta
    else if (Selecionada) backgroundColor = "#DB0004", color = "#DB0004"; // vermelha se errada
  }
  
    return (
    <Pressable 
    onPress={onPress}
    disabled={ResultadoVisivel}
    style={({ pressed }) => [
    styles.Alternativa,
    pressed && { shadowOffset: { width: 0, height: 2}, shadowColor: "#AAAAAA" },
    {backgroundColor}
    ]}
    >
      <View style = {styles.Alternativa0}>
        <Text style = {[styles.TextoAlternativa0, {color}]}>{Alternativa}</Text>
        <Text style = {styles.TextoAlternativa0Borda}>{Alternativa}</Text>
      </View>

      <Text style = {styles.TextoResposta}>{Resposta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Alternativa: {
    width: "100%",
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#CFC9C9",
    shadowOffset: {width: 0, height: 4,},
    shadowRadius: 0,
    shadowColor: "#AAAAAA",
  },

  Alternativa0:{
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 20,
    shadowOffset: {width: 0, height: 2,},
    shadowRadius: 0,
    shadowColor: "#000000",
  },

  TextoAlternativa0:{
    fontFamily: "RubikOne",
    fontSize: scaleFont(20),
    zIndex: 2,
  },

  TextoAlternativa0Borda:{
    position: "absolute",
    fontFamily: "RubikOne",
    fontSize: scaleFont(22),
    zIndex: 1,
    textShadowOffset: {width: 0, height: 1,},
    textShadowRadius: 0,
    textShadowColor: "#000000",
  },

  TextoResposta:{
    fontSize: scaleFont(14),
    fontFamily: "RubikOne",
    color: "#FFFFFF",
  },
  
});

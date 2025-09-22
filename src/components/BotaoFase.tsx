import React, { useState } from "react";
import { View, Pressable, TouchableOpacity, ImageBackground, Text, StyleSheet } from "react-native";

type Props = {
  numero: number;
  onPress: () => void; // Alterado de 'destino' para 'onPress'
};

export default function BotaoFase({ numero, onPress }: Props) {
  const [mostrarBalao, setMostrarBalao] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.BotaoFase,
          pressed && { shadowOffset: { width: 0, height: 2 }, shadowColor: "#C1C1C1" },
        ]}
        onPress={() => setMostrarBalao((prev) => !prev)} // alterna o balão
      >
        <ImageBackground style={styles.ImagemFase} source={require("../images/Fase.png")}>
          <View style={styles.Fase}>
            <Text style={styles.TextoFase}>{numero}</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {mostrarBalao && (
        <View style={styles.balaoContainer}>
          <ImageBackground
            source={require("../images/Balao.png")}
            style={styles.balao}
            imageStyle={{ resizeMode: "contain" }}
          >
            <Pressable
              style={({ pressed }) => [
                styles.botaoIniciar,
                pressed && { shadowOffset: { width: 0, height: 2 }, shadowColor: "#3D9F42" },
              ]}
              onPress={() => {
                setMostrarBalao(false);
                onPress(); // Chama a função passada por props
              }}
            >
              <Text style={styles.textoIniciar}>Iniciar</Text>
            </Pressable>
          </ImageBackground>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
    zIndex: 10,
    elevation: 10,
  },
  BotaoFase:{
    width: 100,
    height: 100,  
    shadowOffset: {width: 0, height: 4,}, 
    shadowRadius: 0, 
    shadowColor: "#C1C1C1", 
    borderRadius: 50,
  },

  ImagemFase:{
    alignItems: "center", 
    justifyContent: "center", 
    width: "100%", 
    height: "100%",
  },

  Fase:{
    width: 75, 
    height: 75, 
    borderRadius: 40, 
    backgroundColor: "#D7D7D7", 
    alignItems: "center", 
    justifyContent: "center",    
  },

  TextoFase:{
    color: "#898989", 
    fontSize: 40, 
    fontFamily: "RubikOne",
  },

  balaoContainer: {
    alignItems: "center",
  },

  balao: {
    width: 80,
    height: 60, 
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },

  botaoIniciar: {
    backgroundColor: "#00C738",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowOffset: {width: 0, height: 3,},
    shadowColor: "#3D9F42",
    shadowRadius: 0,
  },

  textoIniciar: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "RubikOne",
  },
});
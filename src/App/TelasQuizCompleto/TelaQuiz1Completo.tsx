import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function PainelControle(){
  return(
    <View style = {styles.Tela}>
        <Image source={require("../../images/PlantaNivel1.png")}/>
        <View style = {styles.ConteudoTela}>
            <View style = {styles.ViewTextoTela}>
                <Text style = {styles.TituloTela}>
                    Parabéns!
                </Text>
                <Text style={{ color: "#fff", fontFamily: "RubikOne", fontSize: 16,}}>
                    Completou sua primeira lição!
                </Text>
            </View>

            <Image source={require("../../images/plus20xp.png")}/>

            <View style = {styles.ViewBotoes}>
                <Pressable style={({ pressed }) => [
                    styles.Botao,
                    pressed && { shadowOffset: { width: 0, height: 2}, shadowColor: "#AAAAAA" },
                    ]} 
                    onPress={() => router.replace("/TelasQuiz/TelaQuiz")}
                    >
                        <Text style={{ color: "#fff", fontFamily: "RubikOne", fontSize: 16,}}>Repetir</Text>
                </Pressable>

                <Pressable style={({ pressed }) => [
                    styles.Botao,
                    pressed && { shadowOffset: { width: 0, height: 2}, shadowColor: "#AAAAAA" },
                    ]} 
                    onPress={() => router.replace("/Telas/TelaGame")}
                    >
                        <Text style={{ color: "#fff", fontFamily: "RubikOne", fontSize: 16,}}>Continuar</Text>
                </Pressable>
            </View>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Tela:{
    alignItems: "center",
    justifyContent: "center",
    height: "81%",
    width: "100%",
    backgroundColor: "#503C31",
    padding: 30,
    borderTopWidth: 3,
    borderColor: "#009F32",
    gap: 40,
  },

  ConteudoTela:{
    width: "100%",
    height: 264,
    alignItems: "center", 
    justifyContent: "space-between",
  },

  ViewTextoTela:{
    gap: 10,
    alignItems: "center",
  },

  TituloTela:{
    fontFamily: "RubikOne",
    fontSize: 32,
    color: "#FFD700",
    textShadowOffset: {width: 0, height: 2,},
    textShadowRadius: 0,
    textShadowColor: "#9A8201",
  },

  ViewBotoes:{
    width: "100%",
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  Botao:{
    backgroundColor: "#41B947",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 3, 
    borderColor: "#CFC9C9",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {width: 0, height: 4,}, 
    shadowRadius: 0,
    shadowColor: "#AAAAAA",
  },
})
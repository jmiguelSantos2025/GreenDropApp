import React, { useState } from "react";
import { Modal, TouchableOpacity, Dimensions, Image, ImageBackground, StyleSheet, Text, View, Pressable } from "react-native";
import Alternativa from "../../components/Alternativa";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

const alternativas = [
  { id: 1, Alternativa: "A",Resposta: "Alternativa A", Correta: true },
  { id: 2, Alternativa: "B",Resposta: "Alternativa B", Correta: false },
  { id: 3, Alternativa: "C",Resposta: "Alternativa C", Correta: false },
  { id: 4, Alternativa: "D",Resposta: "Alternativa D", Correta: false },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function PainelControle(){

    const [selecionada, setSelecionada] = useState<number | null>(null);
    const [mostrarResultado, setMostrarResultado] = useState(false);

    const handlePress = (id: number) => {
    setSelecionada(id);
    };

    const handleContinuar = () => setMostrarResultado(true);
    const fecharModal = () => {
        setSelecionada(null);
        setMostrarResultado(false);
        router.replace("/TelasQuizCompleto/TelaQuiz1Completo")
    };

    const correta = alternativas.find(a => a.Correta);

    return(
    <View style = {styles.Tela}>
        <View style = {styles.ConteudoTela}>
                <ImageBackground style = {styles.Imagem}>
                
                </ImageBackground>
                <Text style = {styles.Pergunta}>Pergunta</Text>
                {alternativas.map(alt => (
                <Alternativa
                key={alt.id}
                Alternativa={alt.Alternativa}
                Resposta={alt.Resposta}
                Correta={alt.Correta}
                Selecionada={selecionada === alt.id}
                ResultadoVisivel={mostrarResultado}
                onPress={() => handlePress(alt.id)}
                />
            ))}

            <Modal visible={mostrarResultado} transparent animationType="fade">
                <View style = {styles.Modal}>
                {selecionada === correta?.id ? (
                    <View style={styles.FundoCerto}>
                        <MaterialCommunityIcons name="check-bold" style = {styles.IconCerto}/>
                        <Text style = {styles.TextoCorreto}>
                            Explicação do porque está correta.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.FundoErrado}>
                        <MaterialCommunityIcons name="close-thick" style = {styles.IconErrado}/>
                        <Text style = {styles.TextoIncorreto}>
                            Explicação do porque está incorreta.
                        </Text>
                        <Text style = {styles.TextoCorreto}>
                            Resposta correta:
                        </Text>
                        {correta && (
                          <Alternativa
                            Alternativa={correta.Alternativa}
                            Resposta={correta.Resposta}
                            Correta={true}
                            Selecionada={true}
                            ResultadoVisivel={true} 
                            onPress={() => {}}
                          />
                        )}
                        <Text style = {styles.TextoCorreto}>
                            Explicação do porque está correta.
                        </Text>
                    </View>
                )}
                <View style = {styles.ViewContinuar2}>
                    <Pressable style={({ pressed }) => [
                    styles.BotaoContinuar,
                    pressed && { shadowOffset: { width: 0, height: 2}, shadowColor: "#AAAAAA" },
                    ]} 
                    onPress={fecharModal}
                    >
                        <Text style={{ color: "#fff", fontFamily: "RubikOne", fontSize: 16,}}>Continuar</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
        </View>

        {selecionada !== null && !mostrarResultado && (
            <View style = {styles.ViewContinuar}>
                <Pressable style={({ pressed }) => [
                styles.BotaoContinuar,
                pressed && { shadowOffset: { width: 0, height: 2}, shadowColor: "#AAAAAA" },
                ]} 
                onPress={handleContinuar}
                >
                    <Text style={{ color: "#fff", fontFamily: "RubikOne", fontSize: 16,}}>Continuar</Text>
                </Pressable>
            </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  Tela:{
    alignItems: "center",
    width: "100%",
    height: SCREEN_HEIGHT,
    backgroundColor: "#E9EFEA",
    gap: 15,
  },

  ConteudoTela:{
    width: "100%",
    height: "71%",
    alignItems: "center", 
    gap: 15,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },

  Imagem:{
    width: "100%",
    height: 220,
    backgroundColor: "#DADADA",
    borderWidth: 2,
    borderColor: "#009F32",
    borderStyle: "dashed",
  },

  Pergunta:{
    fontFamily: "RubikOne",
    fontSize: scaleFont(18),
  },

  ViewContinuar:{
    backgroundColor: "#503C31",
    width: "100%",
    height: "30%",
    borderTopWidth: 5,
    borderColor: "#009F32",
    alignItems: "center",
    paddingTop: 13,
  },

  BotaoContinuar:{
    backgroundColor: "#41B947",
    paddingHorizontal: 60,
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

  ViewContinuar2:{
    backgroundColor: "#503C31",
    width: "100%",
    height: "9%",
    borderTopWidth: 5,
    borderColor: "#009F32",
    alignItems: "center",
    paddingTop: 13,
  },

  Modal:{
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },

  FundoCerto:{
    height: "72%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(228, 247, 255, 0.9)",
    gap: 15,
    padding: 30,
  },

  FundoErrado:{
    height: "72%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(253, 231, 231, 0.9)",
    gap: 15,
    padding: 30,
  },

  IconCerto:{
    fontSize: 200,
    color: "#00A4E5",
  },

  IconErrado:{
    fontSize: 200,
    color: "#FF0000",
  },

  TextoCorreto:{
    width: "100%",
    fontFamily: "RubikOne",
    fontSize: 16,
    color: "#00A4E5",
    textAlign: "center",
  },

  TextoIncorreto:{
    width: "100%",
    fontFamily: "RubikOne",
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
  },

  
})
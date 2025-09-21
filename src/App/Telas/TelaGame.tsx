import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, ImageBackground, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BotaoFase from "../../components/BotaoFase";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function GameScreen(){

  const [fontsLoaded] = useFonts({
      RubikOne: require("../../fonts/RubikOne-Regular.ttf"),
      });
  
      if (!fontsLoaded) {
      return null;
  }

  const[Visible, setVisible] = useState(false)

  return (
    <ScrollView contentContainerStyle = {styles.Tela}>
      
        <View style = {styles.ViewTitulos}>
          <View style={styles.View}>
            <View style={styles.Linha} />
            <Text style={styles.Titulo}>Introdução</Text>
            <View style={styles.Linha} />
          </View>
          <Text style = {styles.Subtitulo}>Como a IA entende gestos?</Text>
        </View>
        <View style = {{alignItems: "center",}}>
          <BotaoFase numero={1} destino="/TelasQuiz/TelaQuiz"/>
          <View style = {{alignItems: "center",}}>
            <Image style = {styles.Imagem} source={require("../../images/RioImpar.png")}/>
          </View>
        </View>

        <View style = {styles.ViewTitulos}>
          <View style={styles.View}>
            <View style={styles.Linha} />
            <Text style={styles.Titulo}>Controle de Irrigação</Text>
            <View style={styles.Linha} />
          </View>
          <Text style = {styles.Subtitulo}>Como ativar a rega</Text>
        </View>
        <View style = {{alignItems: "center",}}>
          <BotaoFase numero={2} destino="/TelasQuiz/TelaQuiz"/>
          <View style = {{alignItems: "center",}}>
            <Image style = {styles.Imagem} source={require("../../images/RioPar.png")}/>
          </View>
        </View>

        <View style = {styles.ViewTitulos}>
          <View style={styles.View}>
            <View style={styles.Linha} />
            <Text style={styles.Titulo}>Economia de Água</Text>
            <View style={styles.Linha} />
          </View>
          <Text style = {styles.Subtitulo}>Saiba como econimizar sua água!</Text>

        </View>
        <View style = {{alignItems: "center",}}>
          <BotaoFase numero={3} destino="/TelasQuiz/TelaQuiz"/>
          <View style = {{alignItems: "center",}}>
            <Image style = {styles.Imagem} source={require("../../images/RioImpar.png")}/>
          </View>
        </View>

        <View style = {styles.ViewTitulos}>
          <View style={styles.View}>
            <View style={styles.Linha} />
            <Text style={styles.Titulo}>Desafios Ambientais</Text>
            <View style={styles.Linha} />
          </View>
          <Text style = {styles.Subtitulo}>Conheça os que afetam as plantas!</Text>
        </View>
        <View style = {{alignItems: "center",}}>
          <BotaoFase numero={4} destino="/TelasQuiz/TelaQuiz"/>
          <View style = {{alignItems: "center",}}>
            <Image style = {styles.Imagem} source={require("../../images/RioPar.png")}/>
          </View>
        </View>

        <View style = {styles.ViewTitulos}>
          <View style={styles.View}>
            <View style={styles.Linha} />
            <Text style={styles.Titulo}>Fase Final</Text>
            <View style={styles.Linha} />
          </View>
          <Text style = {styles.Subtitulo}>Como cuidar da sua planta corretamente.</Text>
      </View>
      <View style = {{alignItems: "center",}}>
        <BotaoFase numero={5} destino="/TelasQuiz/TelaQuiz"/>
      </View>

      <View>
        <Text style = {styles.Agradecimentos}>
          Obrigado por completar nosso jogo educativo!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Tela:{
    alignItems: "center",
    height: "72%",
    width: "100%",
    paddingHorizontal: 10, 
    gap: 50,
    paddingVertical: 40,
    marginBottom: 820,

  },

  ViewTitulos:{
    width: "100%",
    alignItems: "center",
    height: "10%",
    zIndex: 1,
  },

  
  View: {
    width: "100%",
    shadowOpacity: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  Linha: {
    shadowOffset:{width: 0, height: 2,},
    shadowColor: "#004A0D",
    borderStyle: "solid",
    borderColor: "#12b144",
    borderTopWidth: 4,
    height: 3,
    flex: 1
  },

  Titulo: {
    textShadowOffset:{width: 0, height: 2,},
    textShadowColor: "#004A0D",
    textShadowRadius: 0,
    fontSize: scaleFont(26),
    fontFamily: "RubikOne",
    color: "#009f32",
    textAlign: "center",
  },

  Subtitulo:{
    textAlign: "center",
    fontFamily: "RubikOne",
    color: "#006A21",
    fontSize: scaleFont(14),
  },

  Imagem:{
    marginBottom: -3,
    position: "absolute",
  },

  Agradecimentos:{
    textAlign: "center",
    fontFamily: "RubikOne",
    fontSize: 16,
    color: "#d7c200ff",
    textShadowOffset: {width: 0, height: 2,},
    textShadowRadius: 0,
    textShadowColor: "#605100ff",
  },
});

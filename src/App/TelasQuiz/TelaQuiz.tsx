import React, { useState } from "react";
import { Modal, TouchableOpacity, Dimensions, Image, ImageBackground, StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import Alternativa from "../../components/Alternativa";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";


const perguntasPorNivel = [
  {
    id: 1,
    pergunta: "Como a inteligência artificial pode ajudar a regar as plantas de forma inteligente?",
    imagem: require("../../images/Questao1.jpeg"),
    alternativas: [
      { id: 1, Alternativa: "A", Resposta: "Regando só quando as plantas precisam", Correta: true },
      { id: 2, Alternativa: "B", Resposta: "Regando sempre no mesmo horário", Correta: false },
      { id: 3, Alternativa: "C", Resposta: "Deixando a mangueira aberta sempre", Correta: false },
      { id: 4, Alternativa: "D", Resposta: "Regando só de manhã cedo", Correta: false },
    ],
    explicacaoCorreta: "A IA sabe quando a planta precisa de água através de sensores, assim não desperdiçamos água!"
  },
  {
    id: 2,
    pergunta: "Como a inteligência artificial ajuda a economizar água em casa?",
    imagem: require("../../images/Questao2.jpeg"),
    alternativas: [
      { id: 1, Alternativa: "A", Resposta: "Desligando as torneiras sozinha", Correta: true },
      { id: 2, Alternativa: "B", Resposta: "Escondendo a água", Correta: false },
      { id: 3, Alternativa: "C", Resposta: "Fechando o chuveiro", Correta: false },
      { id: 4, Alternativa: "D", Resposta: "Guardando água em potes", Correta: false },
    ],
    explicacaoCorreta: "A IA pode fechar torneiras automaticamente quando não estamos usando, evitando desperdício!"
  },
  {
    id: 3,
    pergunta: "Como a IA pode ajudar a proteger os animais e as plantas?",
    imagem: require("../../images/Questao3.jpeg"),
    alternativas: [
      { id: 1, Alternativa: "A", Resposta: "Viglando as florestas", Correta: false },
      { id: 2, Alternativa: "B", Resposta: "Avisando sobre perigos", Correta: false },
      { id: 3, Alternativa: "C", Resposta: "Ensinando as pessoas a cuidar", Correta: false },
      { id: 4, Alternativa: "D", Resposta: "Todas as alternativas", Correta: true },
    ],
    explicacaoCorreta: "A IA ajuda de muitas formas: vigiando, alertando e ensinando como proteger a natureza!"
  },
  {
    id: 4,
    pergunta: "O que a inteligência artificial pode fazer para evitar o desperdício de comida?",
    imagem: require("../../images/Questao4.jpg"),
    alternativas: [
      { id: 1, Alternativa: "A", Resposta: "Comer tudo sozinha", Correta: false },
      { id: 2, Alternativa: "B", Resposta: "Avisar quando a comida vai estragar", Correta: true },
      { id: 3, Alternativa: "C", Resposta: "Esconder a comida", Correta: false },
      { id: 4, Alternativa: "D", Resposta: "Jogar tudo fora", Correta: false },
    ],
    explicacaoCorreta: "A IA pode avisar quando os alimentos estão perto de vencer, assim comemos antes de estragar!"
  },
  {
    id: 5,
    pergunta: "Como a IA ajuda os agricultores a produzir mais comida sem desperdiçar?",
    imagem: require("../../images/Questao5.jpeg"),
    alternativas: [
      { id: 1, Alternativa: "A", Resposta: "Plantando sozinha à noite", Correta: false },
      { id: 2, Alternativa: "B", Resposta: "Mostrando o melhor jeito de plantar", Correta: true },
      { id: 3, Alternativa: "C", Resposta: "Regando com chocolate", Correta: false },
      { id: 4, Alternativa: "D", Resposta: "Fazendo as plantas crescerem rápido", Correta: false },
    ],
    explicacaoCorreta: "A IA ensina os agricultores a plantar do jeito certo, usando pouca água e colhendo muitos alimentos!"
  }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function PainelControle() {
  // Obter o ID da fase dos parâmetros de navegação
  const params = useLocalSearchParams();
  const faseId = params.id ? parseInt(params.id as string) : 1;
  
  // Obter a pergunta atual com base no ID da fase
  const perguntaAtual = perguntasPorNivel.find(p => p.id === faseId) || perguntasPorNivel[0];
  
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const handlePress = (id: number) => {
    setSelecionada(id);
  };

  const handleContinuar = () => setMostrarResultado(true);
  
  const avancarParaProximoNivel = () => {
    setSelecionada(null);
    setMostrarResultado(false);
    
    // Verificar se é nível 3 ou 5 para direcionar para tela de bônus
    if (faseId === 3 || faseId === 5) {
      router.replace(""); // Navega para a tela de bônus
      return;
    }
    // Se não for o último nível, avança para o próximo
    if (faseId < perguntasPorNivel.length) {
      router.replace({
        pathname: "/TelasQuiz/TelaQuiz", // Alterado para a mesma tela
        params: { id: faseId + 1 } // Passa o próximo ID
      });
    } else {
      
      router.replace("/TelasQuizCompleto/TelaConclusaoQuiz");
    }
  };

  const correta = perguntaAtual.alternativas.find(a => a.Correta);

  return(
    <View style = {styles.Tela}>
      <ScrollView 
        style={styles.ScrollView}
        contentContainerStyle={styles.ScrollViewContent}
      >
        <View style = {styles.ConteudoTela}>
          <ImageBackground 
            style={styles.Imagem}
            source={perguntaAtual.imagem}
            resizeMode="cover"
          />
          
          <Text style = {styles.Pergunta}>{perguntaAtual.pergunta}</Text>
          
          {perguntaAtual.alternativas.map(alt => (
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
        </View>
      </ScrollView>

      <Modal visible={mostrarResultado} transparent animationType="fade">
        <View style = {styles.Modal}>
          <ScrollView 
            style={styles.ModalScrollView}
            contentContainerStyle={styles.ModalScrollViewContent}
          >
            {selecionada === correta?.id ? (
              <View style={styles.FundoCerto}>
                <MaterialCommunityIcons name="check-bold" style = {styles.IconCerto}/>
                <Text style = {styles.TextoCorreto}>
                  {perguntaAtual.explicacaoCorreta}
                </Text>
              </View>
            ) : (
              <View style={styles.FundoErrado}>
                <MaterialCommunityIcons name="close-thick" style = {styles.IconErrado}/>
                <Text style = {styles.TextoIncorreto}>
                  Resposta incorreta.
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
                  {perguntaAtual.explicacaoCorreta}
                </Text>
              </View>
            )}
          </ScrollView>
          
          <View style = {styles.ViewContinuar2}>
            <Pressable style={({ pressed }) => [
              styles.BotaoContinuar,
              pressed && { shadowOffset: { width: 0, height: 2}, shadowColor: "#AAAAAA" },
            ]} 
            onPress={avancarParaProximoNivel}
            >
              <Text style={{ color: "#fff", fontFamily: "RubikOne", fontSize: 16,}}>
                {faseId === 3 || faseId === 5 ? "Ir para Bônus" : 
                faseId < perguntasPorNivel.length ? "Próxima Fase" : "Finalizar Quiz"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

  ScrollView: {
    width: "100%",
    flex: 1,
  },

  ScrollViewContent: {
    flexGrow: 1,
  },

  ModalScrollView: {
    width: "100%",
    flex: 1,
  },

  ModalScrollViewContent: {
    flexGrow: 1,
  },

  ConteudoTela:{
    width: "100%",
    minHeight: "71%",
    alignItems: "center", 
    gap: 15,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },

  Imagem:{
    width: "100%",
    height: 220,
    borderWidth: 2,
    borderColor: "#009F32",
    borderRadius: 10,
  },

  Pergunta:{
    fontFamily: "RubikOne",
    fontSize: scaleFont(18),
    textAlign: "center",
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
    minHeight: "72%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(228, 247, 255, 0.9)",
    gap: 15,
    padding: 30,
  },

  FundoErrado:{
    minHeight: "72%",
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
});
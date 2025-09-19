// app/camera.tsx
import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

const { width } = Dimensions.get("window");
const BOX_SIZE = width * 0.5;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [prediction, setPrediction] = useState<string>("Aguardando...");

  const cameraRef = useRef<Camera>(null);
  const modelRef = useRef<tf.GraphModel | null>(null);

  // Pedir permissão para a câmera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Inicializar TensorFlow e carregar modelo
  useEffect(() => {
    (async () => {
      await tf.ready();
      setIsTfReady(true);

      try {
        const modelJson = require("../Dev/model.json");
        const modelWeights = require("../Dev/metadata.json");
        modelRef.current = await tf.loadGraphModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        console.log("Modelo carregado com sucesso!");
      } catch (err) {
        console.log("Erro ao carregar modelo:", err);
      }
    })();
  }, []);

  // Função para tirar foto e gerar predição (exemplo simplificado)
  const handleCameraStream = async () => {
    if (!cameraRef.current || !modelRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        skipProcessing: true,
      });

      // Aqui você precisaria converter base64 em tensor compatível com seu modelo
      // Para simplificar, vamos apenas mostrar que a foto foi tirada
      setPrediction("Foto capturada! (Adapte para predição real)");
    } catch (err) {
      console.log("Erro ao capturar foto:", err);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false)
    return <Text>Sem acesso à câmera. Permita a câmera no app.</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        ref={cameraRef}
        onCameraReady={handleCameraStream}
      />
      {/* Quadrado de visualização */}
      <View style={styles.box}>
        <Text style={styles.prediction}>{prediction}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  box: {
    position: "absolute",
    top: "40%",
    left: "25%",
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 3,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  prediction: {
    color: "white",
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
    borderRadius: 4,
    textAlign: "center",
  },
});

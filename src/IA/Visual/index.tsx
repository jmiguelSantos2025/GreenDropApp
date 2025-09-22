// app/camera.tsx
import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, Animated, Easing, Platform } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get("window");
const BOX_SIZE = width * 0.6;

// Ajustes fáceis
const INTERVAL_MS = 1500;
const DETECTION_THRESHOLD = 0.7;
const MIN_ALERT_INTERVAL_MS = 2000;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [predictionText, setPredictionText] = useState<string>("Inicializando...");
  const [confidence, setConfidence] = useState<number>(0);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const cameraRef = useRef<Camera | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const metadataRef = useRef<any | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastDetectedRef = useRef<{ label?: string; ts?: number }>({});
  
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Pedir permissão da câmera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Inicializar TensorFlow
  useEffect(() => {
    let isMounted = true;

    const initializeTensorFlow = async () => {
      try {
        console.log("🔄 Inicializando TensorFlow...");
        await tf.ready();
        console.log("✅ TensorFlow pronto");
        
        if (isMounted) {
          setIsTfReady(true);
          setPredictionText("TensorFlow carregado");
        }
      } catch (error) {
        console.log("❌ Erro ao inicializar TensorFlow:", error);
        if (isMounted) {
          setPredictionText("Erro no TensorFlow");
          setLoadError("Falha ao inicializar TensorFlow");
        }
      }
    };

    initializeTensorFlow();

    return () => {
      isMounted = false;
    };
  }, []);

  // Carregar modelo após TensorFlow estar pronto
  useEffect(() => {
    if (!isTfReady) return;

    let isMounted = true;

    const loadModel = async () => {
      try {
        setPredictionText("Carregando modelo...");
        console.log("🔄 Tentando carregar modelo...");

        // Primeiro, carregar metadata
        try {
          // Importação direta do metadata
          const metadata = {
            labels: ["Mão Aberta - Irrigar", "Mão Fechada - Desligar", "Mão L - Esquerda", "Mão 2 - Direita", "Fundo"],
            imageSize: 224
          };
          metadataRef.current = metadata;
          console.log("✅ Metadata carregado:", metadata.labels);
        } catch (metadataError) {
          console.log("⚠️  Erro ao carregar metadata, usando padrão:", metadataError);
          metadataRef.current = {
            labels: ["Mão Aberta - Irrigar", "Mão Fechada - Desligar", "Mão L - Esquerda", "Mão 2 - Direita", "Fundo"],
            imageSize: 224
          };
        }

        // Tentativa 1: Carregar usando require padrão
        try {
          console.log("🔄 Tentando carregar com require...");
          const modelJson = require("../Dev/model.json");
          const modelWeights = require("../Dev/weights.bin");
          
          console.log("📦 Arquivos encontrados, carregando modelo...");
          
          // Para modelos do Teachable Machine, use tf.loadLayersModel em vez de loadGraphModel
          modelRef.current = await tf.loadLayersModel(
            bundleResourceIO(modelJson, modelWeights)
          );
          
          console.log("✅ Modelo carregado com sucesso!");
          console.log("📊 Resumo do modelo:");
          modelRef.current.summary();
          
          if (isMounted) {
            setModelLoaded(true);
            setPredictionText("Pronto para detectar gestos");
            setLoadError(null);
          }
          return;
        } catch (requireError) {
          console.log("❌ Erro ao carregar com require:", requireError);
        }

        // Tentativa 2: Carregar via URI (fallback)
        try {
          console.log("🔄 Tentando carregar via URI...");
          // Você precisaria hospedar os arquivos online para esta abordagem
          setPredictionText("Tentando método alternativo...");
        } catch (uriError) {
          console.log("❌ Erro ao carregar via URI:", uriError);
        }

        // Se todas as tentativas falharem
        throw new Error("Não foi possível carregar o modelo");

      } catch (error) {
        console.log("❌ Erro crítico ao carregar modelo:", error);
        if (isMounted) {
          setPredictionText("Erro ao carregar modelo");
          setLoadError(error.message);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [isTfReady]);

  // Função para capturar e prever
  const captureAndPredict = async () => {
    if (!cameraRef.current || !modelRef.current || !metadataRef.current || isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.6,
        skipProcessing: true,
      });

      if (!photo?.base64) {
        setIsProcessing(false);
        return;
      }

      await predictFromBase64(photo.base64);
    } catch (err) {
      console.log("Erro ao capturar foto:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Pré-processamento e inferência
  const predictFromBase64 = async (base64: string) => {
    if (!modelRef.current || !metadataRef.current) return;

    try {
      const imageSize = metadataRef.current.imageSize || 224;
      const labels: string[] = metadataRef.current.labels || [];

      // Converter base64 para tensor
      const base64Data = base64.startsWith('data:image') 
        ? base64.split(',')[1] 
        : base64;
      
      // Usar tf.util.decodeString para evitar problemas com Buffer
      const rawImageData = tf.util.encodeString(base64Data, 'base64').buffer;
      const u8Array = new Uint8Array(rawImageData);
      
      // Decodificar JPEG
      const imageTensor = decodeJpeg(u8Array);
      
      // Pré-processamento para modelo do Teachable Machine
      const processedTensor = tf.tidy(() => {
        // Redimensionar
        let tensor = tf.image.resizeBilinear(imageTensor as tf.Tensor3D, [imageSize, imageSize]);
        
        // Normalizar para [0, 1]
        tensor = tensor.toFloat().div(tf.scalar(255));
        
        // Adicionar dimensão de batch
        return tensor.expandDims(0);
      });

      // Fazer predição
      const prediction = modelRef.current.predict(processedTensor) as tf.Tensor;
      const probabilities = await prediction.data();
      
      // Encontrar a classe com maior probabilidade
      let maxIndex = 0;
      let maxProbability = probabilities[0];
      
      for (let i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > maxProbability) {
          maxProbability = probabilities[i];
          maxIndex = i;
        }
      }

      const confidenceValue = Math.round(maxProbability * 1000) / 10;
      const label = labels[maxIndex] || `Classe ${maxIndex}`;

      // Atualizar UI
      setPredictionText(label);
      setConfidence(confidenceValue);

      // Animar barra de progresso
      Animated.timing(progressAnim, {
        toValue: confidenceValue,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false
      }).start();

      // Verificar se deve mostrar alerta
      if (maxProbability >= DETECTION_THRESHOLD) {
        const now = Date.now();
        const last = lastDetectedRef.current;
        
        if (!last.label || last.label !== label || !last.ts || now - last.ts > MIN_ALERT_INTERVAL_MS) {
          let action = "Nenhuma ação";
          
          if (label.includes("Irrigar")) action = "IRRIGAR";
          else if (label.includes("Desligar")) action = "DESLIGAR";
          else if (label.includes("Esquerda")) action = "VIRAR À ESQUERDA";
          else if (label.includes("Direita")) action = "VIRAR À DIREITA";
          
          Alert.alert(
            "Gesto Detectado", 
            `${label}\nConfiança: ${confidenceValue}%\nAção: ${action}`
          );
          
          lastDetectedRef.current = { label, ts: now };
        }
      }

      // Limpar tensores
      tf.dispose([imageTensor, processedTensor, prediction]);

    } catch (error) {
      console.log("Erro na predição:", error);
      setPredictionText("Erro na análise");
    }
  };

  // Iniciar loop de captura quando tudo estiver pronto
  useEffect(() => {
    if (isTfReady && modelLoaded && hasPermission) {
      console.log("🚀 Iniciando loop de captura...");
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        captureAndPredict();
      }, INTERVAL_MS) as unknown as number;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTfReady, modelLoaded, hasPermission]);

  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  const getProgressColor = () => {
    if (confidence < 50) return '#ff3b30';
    if (confidence < 75) return '#ff9500';
    return '#34c759';
  };

  // Tela de debug para problemas de carregamento
  if (loadError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle" size={64} color="#ff9500" />
        <Text style={styles.errorTitle}>Erro ao Carregar Modelo</Text>
        <Text style={styles.errorText}>{loadError}</Text>
        <Text style={styles.debugText}>
          Verifique se os arquivos model.json e weights.bin estão na pasta assets/Dev/
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="camera-off" size={64} color="#ff3b30" />
        <Text style={styles.permissionText}>Sem acesso à câmera.</Text>
        <Text style={styles.permissionSubText}>Permita o acesso à câmera nas configurações do dispositivo.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
        ref={cameraRef}
        ratio="16:9"
      />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Detector de Gestos</Text>
          <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
            <Ionicons name="camera-reverse" size={28} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.box}>
          <View style={styles.boxBorder} />
          <View style={styles.boxCornerTL} />
          <View style={styles.boxCornerTR} />
          <View style={styles.boxCornerBL} />
          <View style={styles.boxCornerBR} />
        </View>
        
        <View style={styles.resultPanel}>
          <Text style={styles.predictionLabel}>Gesto detectado:</Text>
          <Text style={styles.prediction}>{predictionText}</Text>
          
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceHeader}>
              <Text style={styles.confidenceLabel}>Confiança:</Text>
              <Text style={styles.confidenceValue}>{confidence}%</Text>
            </View>
            
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { width: progressWidth, backgroundColor: getProgressColor() }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Legenda dos Gestos:</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#34c759' }]} />
              <Text style={styles.legendText}>Mão Aberta - Irrigar</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ff3b30' }]} />
              <Text style={styles.legendText}>Mão Fechada - Desligar</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#007aff' }]} />
              <Text style={styles.legendText}>Sinal L - Esquerda</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ffcc00' }]} />
              <Text style={styles.legendText}>Sinal 2 - Direita</Text>
            </View>
          </View>
        </View>
        
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingSpinner}>
              <Ionicons name="scan" size={40} color="white" />
              <Text style={styles.processingText}>Processando...</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 20
  },
  errorTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  debugText: {
    color: '#8e8e93',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center'
  },
  permissionSubText: {
    color: '#8e8e93',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24
  },
  camera: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700'
  },
  flipButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  box: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: BOX_SIZE,
    height: BOX_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12
  },
  boxCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#007aff',
    borderRadius: 2
  },
  boxCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#007aff',
    borderRadius: 2
  },
  boxCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#007aff',
    borderRadius: 2
  },
  boxCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#007aff',
    borderRadius: 2
  },
  resultPanel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30
  },
  predictionLabel: {
    color: '#8e8e93',
    fontSize: 14,
    marginBottom: 4
  },
  prediction: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20
  },
  confidenceContainer: {
    marginBottom: 20
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  confidenceLabel: {
    color: '#8e8e93',
    fontSize: 14
  },
  confidenceValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 3
  },
  legend: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12
  },
  legendTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  legendText: {
    color: 'white',
    fontSize: 12
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  processingSpinner: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 16
  },
  processingText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16
  }
});
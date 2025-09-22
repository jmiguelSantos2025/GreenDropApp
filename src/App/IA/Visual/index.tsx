// app/camera.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Asset } from "expo-asset";

const { width } = Dimensions.get("window");
const BOX_SIZE = width * 0.6;

// Tela simples para testar um modelo exportado do Teachable Machine (TFJS)
export default function CameraScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // tf/runtime
  const tfRef = useRef<any | null>(null);
  const tfrnRef = useRef<any | null>(null);
  const cameraWithTensorsRef = useRef<any | null>(null);
  const modelRef = useRef<any | null>(null);
  const rafRef = useRef<number | null>(null);
  const stopRef = useRef(false);

  const [status, setStatus] = useState("Aguardando...");
  const [label, setLabel] = useState("—");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [tfReady, setTfReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [useTf, setUseTf] = useState(true);
  const [error, setError] = useState<any>(null);

  // labels: tenta carregar labels.json em assets/models/labels.json — se não existir, usa fallback
  const [classNames, setClassNames] = useState<string[]>([
    "Classe 0",
    "Classe 1",
    "Classe 2",
    "Classe 3",
  ]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (e) {
        console.error("Erro pedido permissão:", e);
        setError(e);
      }
    })();
  }, []);

  // função que inicializa TF e carrega modelo (pensado para modelos do Teachable Machine)
  const initTfAndLoadModel = async () => {
    setError(null);
    setStatus("Carregando dependências do TF...");
    try {
      // import dinâmico para evitar crash no import top-level
      const tf = await import("@tensorflow/tfjs");
      const tfjsrn = await import("@tensorflow/tfjs-react-native");
      tfRef.current = tf;
      tfrnRef.current = tfjsrn;
      cameraWithTensorsRef.current = tfjsrn.cameraWithTensors;

      // tenta carregar labels.json local se existir
      try {
        // coloque um arquivo labels.json em assets/models/labels.json (array de strings)
        // ex: ["Mão Aberta", "Mão Fechada", "Fundo"]
        // use require porque Asset.loadAsync aceita require()
        // caso não exista, o require lançará — por isso envolvemos em try/catch
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const lbls = require("../../assets/models/labels.json");
        if (Array.isArray(lbls)) setClassNames(lbls);
      } catch (e) {
        console.log("labels.json não encontrado em assets/models — usando fallback.");
      }

      setStatus("Pré-carregando assets do modelo...");
      const modelJson = require("../../assets/models/model.json");
      // se seu model exportou múltiplos shards, adicione todos aqui no array
      const modelWeights = require("../../assets/models/weights.bin");
      await Asset.loadAsync([modelJson, modelWeights]);

      setStatus("tf.ready()...");
      await tf.ready();

      // backend preferencial: rn-webgl (melhor performance). fallback: cpu
      try {
        await tf.setBackend("rn-webgl");
        await tf.ready();
        console.log("Backend rn-webgl selecionado");
      } catch (e) {
        console.warn("rn-webgl não disponível, fallback para cpu:", e);
        await tf.setBackend("cpu");
        await tf.ready();
      }

      setTfReady(true);
      setStatus("Carregando modelo (tentando LayersModel — padrão TM)...");
      try {
        // Teachable Machine geralmente exporta layers-model (keras) -> loadLayersModel
        modelRef.current = await tf.loadLayersModel(tfrnRef.current.bundleResourceIO(modelJson, [modelWeights]));
        setModelReady(true);
        setStatus("Modelo carregado (LayersModel) ✅");
      } catch (layersErr) {
        console.warn("loadLayersModel falhou, tentando loadGraphModel:", layersErr);
        try {
          modelRef.current = await tf.loadGraphModel(tfrnRef.current.bundleResourceIO(modelJson, [modelWeights]));
          setModelReady(true);
          setStatus("Modelo carregado (GraphModel) ✅");
        } catch (graphErr) {
          console.error("Falha ao carregar modelo (layers+graph):", graphErr);
          throw graphErr;
        }
      }
    } catch (e) {
      console.error("Erro inicializando TF/model:", e);
      setError(e);
      setStatus("Falha ao inicializar TF/model. Ative modo câmera apenas ou verifique assets.");
      setUseTf(false); // fallback: não tentar mais TF
    }
  };

  useEffect(() => {
    if (useTf) initTfAndLoadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useTf]);

  // modo só câmera
  const renderCameraOnly = () => {
    if (hasPermission === null) return centerText("Solicitando permissão...");
    if (hasPermission === false) return centerText("Permissão de câmera negada.");

    return (
      <View style={styles.container}>
        <Camera ref={cameraRef} style={styles.camera} type={CameraType.back} />
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.label}>Modo: Apenas Câmera</Text>
            <Text style={styles.confidence}>{label}</Text>
          </View>
          <View style={styles.status}>
            <Text style={styles.statusText}>{status}</Text>
            <View style={{ marginTop: 8 }}>
              <Button title="Tentar TF" onPress={() => { setUseTf(true); setStatus("Tentando TF..."); }} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!useTf) return renderCameraOnly();
  if (error) return errorBox(error);
  if (!tfReady || !modelReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>{status}</Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Pular TF (modo câmera)" onPress={() => setUseTf(false)} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Tentar inicializar TF de novo" onPress={() => initTfAndLoadModel()} />
        </View>
      </View>
    );
  }

  // Se chegou aqui tf e modelo prontos
  const cameraWithTensors = cameraWithTensorsRef.current;
  if (!cameraWithTensors) return errorBox("cameraWithTensors não disponível.");

  const TFCamera = cameraWithTensors(Camera as any);

  const handleCameraStream = (images: IterableIterator<any>) => {
    if (!modelRef.current) return;
    stopRef.current = false;

    const tf = tfRef.current;

    const loop = async () => {
      if (stopRef.current) return;

      const next = images.next();
      const imageTensor = next?.value;

      if (!imageTensor) {
        await tf.nextFrame();
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      try {
        const input = tf.tidy(() => {
          let t = imageTensor;
          t = tf.image.resizeBilinear(t, [224, 224]); // ajuste se modelo esperar outro tamanho
          t = t.toFloat().div(tf.scalar(255));
          return t.expandDims(0);
        });

        // para LayersModel você também pode usar model.predict(input)
        let out;
        if (typeof modelRef.current.predict === "function") {
          out = modelRef.current.predict(input);
        } else {
          out = await modelRef.current.executeAsync(input);
        }

        let scores: number[] = [];
        if (Array.isArray(out)) {
          const first = out[0];
          scores = Array.from(await first.data());
          out.forEach((t: any) => t.dispose());
        } else {
          scores = Array.from(await (out as any).data());
          (out as any).dispose();
        }

        // argmax
        let maxIdx = 0;
        for (let i = 1; i < scores.length; i++) if (scores[i] > scores[maxIdx]) maxIdx = i;

        setLabel(classNames[maxIdx] ?? `Classe ${maxIdx}`);
        setConfidence(scores[maxIdx]);
        tf.dispose(input);
        imageTensor.dispose();
      } catch (e) {
        console.error("Erro na inferência:", e);
        setError(e);
      }

      await tf.nextFrame();
      rafRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  return (
    <View style={styles.container}>
      <TFCamera
        ref={cameraRef as any}
        style={styles.camera}
        type={CameraType.back}
        onReady={(images: IterableIterator<any>) => handleCameraStream(images)}
        autorender
        cameraTextureWidth={1080}
        cameraTextureHeight={1920}
        resizeWidth={224}
        resizeHeight={224}
        resizeDepth={3}
      />

      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.label}>Label: {label}</Text>
          <Text style={styles.confidence}>
            {confidence !== null ? (confidence * 100).toFixed(1) + "%" : ""}
          </Text>
        </View>
        <View style={styles.status}>
          <Text style={styles.statusText}>{status}</Text>
          <View style={{ marginTop: 6 }}>
            <Button title="Desativar TF (apenas câmera)" onPress={() => setUseTf(false)} />
          </View>
        </View>
      </View>
    </View>
  );
}

/* helpers visuais */
function centerText(text: string) {
  return (
    <View style={styles.center}>
      <ActivityIndicator />
      <Text style={{ marginTop: 8 }}>{text}</Text>
    </View>
  );
}
function errorBox(err: any) {
  return (
    <View style={styles.center}>
      <Text style={{ color: "#900", fontWeight: "700", marginBottom: 8 }}>Erro:</Text>
      <ScrollView style={{ maxHeight: 220, width: "90%" }}>
        <Text selectable>{String(err)}</Text>
      </ScrollView>
      <Text style={{ marginTop: 8 }}>Cheque console/Metro para logs completos.</Text>
      <View style={{ marginTop: 12 }}>
        <Button title="Entrar modo câmera" onPress={() => { /* usuário pode reiniciar app em modo câmera se preferir */ }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  box: {
    width: BOX_SIZE,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    alignItems: "center",
  },
  label: { color: "#fff", fontSize: 18, fontWeight: "700", textAlign: "center" },
  confidence: { color: "#fff", marginTop: 6 },
  status: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: { color: "#fff", fontSize: 12 },
});

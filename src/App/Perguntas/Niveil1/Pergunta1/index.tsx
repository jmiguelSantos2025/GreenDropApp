// app/quiz.tsx
import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Pergunta1() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = "Qual é a capital do Brasil?";
  const options = [
    "1) Rio de Janeiro",
    "2) Brasília",
    "3) São Paulo",
    "4) Salvador",
  ];

  const handleContinue = () => {
    router.push("../../GreenDrop/src/IA/Visual"); // tela destino
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.question}>{question}</Text>

        {options.map((opt, index) => (
          <Pressable
            key={index}
            style={[
              styles.option,
              selectedOption === index && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(index)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === index && styles.selectedOptionText,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}

        <Pressable
          style={[styles.continueButton, !selectedOption && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={selectedOption === null}
        >
          <Text style={styles.continueText}>Continuar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  question: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: "#0b8a39",
    borderColor: "#0b8a39",
  },
  optionText: { fontSize: 16 },
  selectedOptionText: { color: "#fff", fontWeight: "700" },
  continueButton: {
    marginTop: "auto",
    backgroundColor: "#0b8a39",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

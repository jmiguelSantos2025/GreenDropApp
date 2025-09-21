import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/Telas/PainelControle"); 
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.TelaCarregamento}>
      <Image source={require("../images/LogoGreenDrop.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  TelaCarregamento: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

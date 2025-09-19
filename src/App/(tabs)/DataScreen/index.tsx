// MainScreen.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  Dimensions,
} from "react-native";

const TAB_BAR_HEIGHT = 64; // altura reservada para a tab bar (ajuste se necessário)

export default function DataScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={styles.top.backgroundColor} />
      <View style={styles.top}>
        <Image
          source={require("../../../../assets/Logo.png")} 
          style={styles.topImage}
          resizeMode="contain"
        />
      </View>

      {/* Middle 70% - área branca */}
      <View style={styles.middle}>
      </View>

      {/* Linha verde fina acima da tab bar (opcional) */}
      <View style={styles.topDivider} />

      {/* Espaço reservado para a Tab Bar */}
      <View style={styles.tabBarPlaceholder}>
        <Text style={styles.tabText}>Tab Bar (reserva) — substitua pela sua Tab Navigator</Text>
      </View>
    </SafeAreaView>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffff", 
  },

  
  top: {
    flex: 1.4, 
    backgroundColor: "#005C1A", 
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  topImage: {
    width: "70%", 
    height: "70%",
  },

  
  middle: {
    flex: 7, 
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor:"#E9EFEA"
  },
  
  
  topDivider: {
    height: 4,
    backgroundColor: "#1f9a3f",
  },

  // Placeholder tab bar (substitua pelo seu BottomTabNavigator)
  tabBarPlaceholder: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: "#6b3f2e", // marrom do mock
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: "#ffffff",
    fontSize: 12,
  },
});

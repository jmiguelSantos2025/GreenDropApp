import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Image } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle:{
          width: SCREEN_WIDTH,
          height: 80,
          flexDirection: "row",
          alignItems: "center",
          borderTopWidth: 4,
          borderColor: "#06A924", 
          backgroundColor: "#503C31",
        },
      })}
    >
      <Tabs.Screen 
      name="PainelControle" 
      options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../images/ControleSelecionado.png")
                  : require("../../images/Controle.png")
              }
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          ),
        }}
      />
      <Tabs.Screen 
      name="TelaGame" 
      options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../images/GameSelecionado.png")
                  : require("../../images/Game.png")
              }
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          ),
        }}
      />
    </Tabs>
  );
}


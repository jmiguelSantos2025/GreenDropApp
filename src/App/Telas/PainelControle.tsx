import React from "react";
import { StyleSheet, View } from "react-native";

export default function PainelControle(){
  return(
    <View style = {styles.ConteudoTela}>

    </View>
  );
}

const styles = StyleSheet.create({
  ConteudoTela:{
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#E9EFEA",
    padding: 30,
  },
})
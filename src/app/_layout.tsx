import React, { useState } from "react";
import { Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, FontAwesome, FontAwesome6, MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, Slot, usePathname } from "expo-router";
import { useFonts } from "expo-font";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function LayoutGameScreen() {

    const [fontsLoaded] = useFonts({
    RubikOne: require("../fonts/RubikMonoOne-Regular.ttf"),
    });

    if (!fontsLoaded) {
    return null;
    }


    const pathname = usePathname();

    const TelaControle = pathname === "/"

    const vida = 3

    const [xp,setXp] = useState(0)

    return (
        <View style = {styles.ContainerTela}>
            {TelaControle ?(
                <View>
                <Image source={require("../images/LogoGreenDrop.png")}/>
                <TouchableOpacity
                onPress={() => router.push("/GameScreen/TelaGame")}
                style={{borderWidth: 10,}}
                >
                BOTAO
                </TouchableOpacity>
                </View>
            ) : (
                <View style = {{alignItems: "center",}}>
                    <Image source={require("../images/LogoQuizGreenDrop.png")}/>
                    <View style = {styles.StatusBar}>
                        <View style = {{gap: 5, flexDirection: "row", alignItems: "center",}}>
                            <View  style = {styles.ImageXP}>
                                <Image source={require("../images/20xp.png")}/>
                            </View>
                            <View style = {styles.BarraXPvazia}>
                                <Text style = {{width: "100%", textAlign: "center", fontFamily: "RubikOne", fontWeight: "bold", color: "#00330E",}}>{xp}/100</Text>
                            </View>
                        </View>
                        <View style = {{alignItems: "center", justifyContent: "center", flexDirection: "row",}}>
                            <Image source={require("../images/Drop.png")}/>
                            <Text style = {{fontFamily: "RubikOne", fontSize: 32, color: "#00A6E7", textShadowColor:"#00587B", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0,}}>{vida}</Text>
                        </View>
                    </View>
                </View>
            )}
            <Slot/>
        </View>
  );
}

const styles = StyleSheet.create({
    ContainerTela:{
        flex: 1,
        backgroundColor: "#005C1A",
        alignItems: "center",
    },
    StatusBar:{
        width: SCREEN_WIDTH,
        height: "40%",
        backgroundColor: "#004A0D",
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: "#00C738",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    ImageXP:{
        alignItems: "center",
        justifyContent: "center",
        width: 35,
        height: 35,
        backgroundColor: "#FFFCE4",
        borderWidth: 2, 
        borderRadius: 20,
        shadowOffset: {width: 0,height: 2,},
    },

    BarraXPvazia:{
        width: 100,
        height: 30,
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFCE4",
        borderRadius: 20,
        boxShadow: "0px 2px 0px #000",
    },


});
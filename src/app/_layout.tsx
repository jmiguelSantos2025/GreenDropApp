import React, { useState } from "react";
import { Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo, FontAwesome, FontAwesome6, MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, Slot, usePathname } from "expo-router";
import { useFonts } from "expo-font";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

export default function LayoutGameScreen() {

    const pathname = usePathname();

    const TelaCarregamento = pathname === "/"

    const TelaControle = pathname === "/Telas/PainelControle"

    const TelaQuiz1Completo = pathname === "/TelasQuizCompleto/TelaQuiz1Completo"

    const [fontsLoaded] = useFonts({
    RubikOne: require("../fonts/RubikOne-Regular.ttf"),
    });

    if (!fontsLoaded) {
    return null;
    }

    const vida = 3

    return (
        <View style = {styles.ContainerTela}>
            {TelaCarregamento ?(
                <View>

                </View>
            ) : TelaControle ? (
                <View style = {{width: "100%", alignItems: "center", borderBottomWidth: 4, borderColor: "#00C738",}}>
                <Image source={require("../images/LogoGreenDrop.png")}/>
                </View>
            ) : TelaQuiz1Completo ? (
                <View>
                    <View style = {{alignItems: "center", }}>
                    <Image source={require("../images/LogoQuizGreenDrop.png")}/>
                    <View style = {styles.StatusBar}>
                        <View style = {{gap: 5, flexDirection: "row", alignItems: "center",}}>
                            <View  style = {styles.ImageXP}>
                                <Image source={require("../images/20xp.png")}/>
                            </View>

                            <View style = {{borderWidth: 3, borderRadius: 20, boxShadow: "0px 2px 0px #000",}}>
                                <View style = {styles.BarraXPCheia}/>
                                <View style = {styles.BarraXPvazia}/>
                                <View style = {{width: "100%", height: "100%", alignItems: "center", justifyContent: "center", position: "absolute", zIndex: 3,}}>
                                    <Text style = {{width: "100%", textAlign: "center", fontFamily: "RubikOne", fontWeight: "bold", color: "#00330E", textAlignVertical: "center"}}>20/100</Text>
                                </View>
                            </View>
                        </View>
                        <View style = {{alignItems: "center", justifyContent: "center", flexDirection: "row",}}>
                            <Image source={require("../images/Drop.png")}/>
                            <Text style = {{fontFamily: "RubikOne", fontSize: 32, color: "#00A6E7", textShadowColor:"#00587B", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 0,}}>{vida}</Text>
                        </View>
                    </View>
                    </View>
                </View>
            ) : (
                <View style = {{alignItems: "center",}}>
                    <Image source={require("../images/LogoQuizGreenDrop.png")}/>
                    <View style = {styles.StatusBar}>
                        <View style = {{gap: 5, flexDirection: "row", alignItems: "center",}}>
                            <View  style = {styles.ImageXP}>
                                <Image source={require("../images/20xp.png")}/>
                            </View>
                            <View style = {{borderWidth: 3, borderRadius: 20, boxShadow: "0px 2px 0px #000",}}>
                                <View style = {styles.BarraXPvazia}>
                                    <Text style = {{width: "100%", textAlign: "center", fontFamily: "RubikOne", fontWeight: "bold", color: "#00330E", zIndex: 3,}}>0/100</Text>
                                </View>
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
        borderTopWidth: 3,
        borderBottomWidth: 3,
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFCE4",
        borderRadius: 20,
        zIndex: 1,
    },

    BarraXPCheia:{
        position: "absolute",
        backgroundColor: "#FFF06A",
        zIndex: 2,
        width: "30%",
        height: "100%",
        borderRightWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },


});
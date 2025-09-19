
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GameScreen from '../GameScreen';
import DataScreen from '../DataScreen';


const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="Game" component={GameScreen} />
        <Tab.Screen name="Data" component={DataScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
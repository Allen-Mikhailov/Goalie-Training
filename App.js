import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

import Home from './screens/Home';
import Game from "./screens/Game"

export default function App() {
  const [ screen, setScreen ] = useState("home")

  useEffect(() => {
    console.log(StatusBar.currentHeight)
  })

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {screen == "home" ? <Home setScreen={setScreen}/> : null}
      {screen == "game" ? <Game setScreen={setScreen}/> : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: STATUSBAR_HEIGHT,
    height: height
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

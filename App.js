import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

import Home from './screens/Home';
import Game from "./screens/Game"

import HighscoreDisplay from './components/HighscoreDisplay';

const highScoreKey = "@highscore:0.0"

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if(value !== null) {
      // value previously stored
    }
  } catch(e) {
    // error reading value
  }
}

export default function App() {
  const [ screen, setScreen ] = useState("home")
  const [ highscore, setHighscore ] = useState(0)
  const [ gotData, setGotData ] = useState(false)

  useEffect(() => {
    getData(highScoreKey).then((storedHighscore) => {
      setHighscore(storedHighscore? parseInt(storedHighscore): 0)
      setGotData(true)
    })
  }, [])

  useEffect(() => {
    if (gotData)
      storeData(highScoreKey, highscore.toString()).then(() => {})
  })

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HighscoreDisplay highscore={highscore}/>
      {screen == "home" ? <Home setScreen={setScreen} highscore={highscore}/> : null}
      {screen == "game" ? <Game setScreen={setScreen} highscore={highscore} setHighscore={setHighscore}/> : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: STATUSBAR_HEIGHT,
    height: height-STATUSBAR_HEIGHT
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

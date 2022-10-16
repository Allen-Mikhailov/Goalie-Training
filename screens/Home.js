import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, Pressable, Animated } from 'react-native';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const HomeIcon = require('../images/play.png')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        fontFamily: "Thonburi-Bold",
        transform: [{rotate: "5deg"}]
    },
    playButtonContainer: {
        width: width * .175,
        height: width * .175,
        top: height*.7,
        position: "absolute",
        backgroundColor: 'black',
        borderRadius: "50%"
    },
    playButton: {
        width: "80%",
        height: "80%",
        left: "10%",
        top: "10%",
        color: "white"
    }
});

export default function Home({ setScreen }) {
    const animation = useRef(new Animated.Value(35)).current
    const buttonPulse = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 50,
              duration: 2500,
              useNativeDriver: false
            }),
            Animated.timing(animation, {
              toValue: 35,
              duration: 2500,
              useNativeDriver: false
            }),
          ]),
          {}
        ).start()

        Animated.loop(
          Animated.sequence([
            Animated.timing(buttonPulse, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: false
            }),
            Animated.timing(buttonPulse, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: false
            }),
          ]),
          {}
        ).start()
      }, [])

      const sizePulse = buttonPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [width * .175, width * .25]
      })

      const paddingPulse = buttonPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [width*(.5-.175/2), width*(.5-.25/2)]
      })

    return <View style={styles.container}>
        <Animated.Text style={[styles.title, {fontSize: animation}]}>Goalie Training</Animated.Text>
        <Pressable style={{width: "100%", height: "100%", position: "absolute"}} onPress={() => setScreen("game")}>
          <Animated.View style={[styles.playButtonContainer, {left: paddingPulse, top: "75%", 
              width: sizePulse, height: sizePulse}]}>
                <Image style={[styles.playButton]} source={HomeIcon} />
          </Animated.View>
        </Pressable>
    </View>
}
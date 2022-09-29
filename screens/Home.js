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
      }, [])


    return <View style={styles.container}>
        <Animated.Text style={[styles.title, {fontSize: animation}]}>Goalie Training</Animated.Text>
        <Pressable style={styles.playButtonContainer} onPress={() => setScreen("game")}>
            <Image style={styles.playButton} source={HomeIcon} />
        </Pressable>
    </View>
}
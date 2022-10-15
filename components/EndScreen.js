import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const styles = StyleSheet.create({
    EndGameScreen: {
        width: "100%",
        height: "100%",
        top: -STATUSBAR_HEIGHT,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    strip: {
        width: width,
        height: 20,
        flex: 1,
        marginBottom: "10%",
        backgroundColor: "black",
        opacity: .75,
        position: "absolute",
        top: 0
    }
})


export default function EndScreen({setScreen, newHighscore})
{
    const anim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
          }).start()
    }, [])

    const screenOpacity = anim.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [0, .3, .3]
      });

    return <Animated.View style={[styles.EndGameScreen, {opacity: screenOpacity}]}>
        <Animated.View style={[styles.strip]}>
            <Text>TEst</Text>
        </Animated.View>
    </Animated.View>
}
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

const MOVE_TIME = 250
const PLAYER_SIZE = .1

const styles = StyleSheet.create({
    Player: {
        position: "absolute",
        width:  width * PLAYER_SIZE,
        height: width * PLAYER_SIZE,
        borderRadius: '50%',
        borderColor: "black",
        backgroundColor: "#aaa",
        borderWidth: 4
    },
})

export default function Player({left, top, style})
{
    const animatedLeft = useRef(new Animated.Value(0)).current
    const animatedTop = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(
            animatedLeft,
            {
              toValue: left,
              duration: MOVE_TIME,
              useNativeDriver: false
            }
          ).start();

          Animated.timing(
            animatedTop,
            {
              toValue: top,
              duration: MOVE_TIME,
              useNativeDriver: false
            }
          ).start();
    }, [left, top])


    return <Animated.View style={[styles.Player, {left: animatedLeft, top: animatedTop}, style]}/>
}
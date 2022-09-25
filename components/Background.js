import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions, Image, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        width: height*1,
        height: height*1,
        left: 0,
        top: -STATUSBAR_HEIGHT,
        backgroundColor: "#BDE8FB"
      }
})

const startingColor = 0xBDE8FB
const endingColor = 0x82D0F3

export default function Background()
{
    const animation = useRef(new Animated.Value(0)).current

    useEffect(() => {
        function forwards()
        {
            Animated.timing(
                animation,
                {
                  toValue: 1,
                  duration: 5000,
                  useNativeDriver: false
                }
              ).start(back);
        }

        function back()
        {
            Animated.timing(
                animation,
                {
                  toValue: 0,
                  duration: 5000,
                  useNativeDriver: false
                }
              ).start(forwards);
        }

        forwards()
    }, [])

    const boxInterpolation =  animation.interpolate({
        inputRange: [0, 1],
        outputRange:["rgb(189, 232, 251)" , "rgb(130, 208, 243)"]
      })
    const animatedStyle = {
        backgroundColor: boxInterpolation
      }

    return <Animated.View style={[styles.background, animatedStyle]}/>
}
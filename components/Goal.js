import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const HEIGHT_LINES = 2
const WIDTH_LINES = 5
const LINE_THICKNESS = 4

const HeightPercent = (height*.1)/(HEIGHT_LINES+1)

const styles = StyleSheet.create({
    Goal: {
        width: width*.5,
        position: "absolute",
        height: height*.1,
        // backgroundColor: "red",
        borderWidth: LINE_THICKNESS,
        top: height*.8,
        left: "25%"
    },
    HorizontalLine: {
        backgroundColor: "black",
        width: "100%",
        height: 0,
        borderWidth: LINE_THICKNESS/2,
        position: 'relative',
    }
})

function range(val)
{
    const arr = []
    for (let i = 0; i<val; i++)
        arr.push(i)
    return arr
}

export default function Goal()
{
    return <View style={styles.Goal}>
        {range(HEIGHT_LINES).map((index) => <View style={[styles.HorizontalLine, {top: HeightPercent*(index+1)-8}]}/>)}
    </View>
}
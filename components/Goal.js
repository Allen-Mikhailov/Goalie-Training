import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const HEIGHT_LINES = 2
const WIDTH_LINES = 3
const LINE_THICKNESS = 4
const GOAL_WIDTH = .3
const GOAL_HEIGHT = .08

const styles = StyleSheet.create({
    Goal: {
        width: width*GOAL_WIDTH,
        position: "absolute",
        height: height*GOAL_HEIGHT,
        // backgroundColor: "red",
        // borderWidth: 4,
        top: height*.82,
        left: (1-GOAL_WIDTH)/2 * 100 +"%"
    },
    HorizontalLine: {
        backgroundColor: "black",
        width: "100%",
        height: 0,
        borderWidth: LINE_THICKNESS/2,
        position: 'absolute',
    },
    VerticalLine: {
        backgroundColor: "black",
        height: "100%",
        width: 0,
        borderWidth: LINE_THICKNESS/2,
        position: 'absolute',
    }
})

export default function Goal()
{
    return <View style={styles.Goal}>
        <View style={[styles.VerticalLine, {left: -LINE_THICKNESS/2}]}/>
        <View style={[styles.VerticalLine, {left: width*GOAL_WIDTH-LINE_THICKNESS/2}]}/>
        <View style={[styles.HorizontalLine, {top: height*GOAL_HEIGHT-LINE_THICKNESS}]}/>
    </View>
}
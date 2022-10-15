import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Image } from 'react-native';
import { useState, useEffect, useRef, ReactPropTypes } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const ICON_SIZE = .075

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",

    },  
    EndGameScreen: {
        width: "100%",
        height: "100%",
        top: -STATUSBAR_HEIGHT,
        backgroundColor: "black",
        // alignItems: "center",
        // justifyContent: "center",
        position: "absolute",
        
    },
    strip: {
        width: "100%",
        height: "10%",
        marginBottom: "5%",
        backgroundColor: "black",
        opacity: .75,
        // position: "absolute"
        // justifyContent: "center ",
        // alignItems: 'center'
    },
    GameOverText: {
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 6,
        fontSize: "40%",
        textAlign: "center",
        // position: "absolute",
        top: "10%"
    },
    spacer: {
        height: "25%"
    },
    newHighScore: {
        textAlignVertical: "center",
        height: "100%",
        fontSize: "35%",
        textAlign: "center",
        color: "yellow",
        justifyContent: "space-evenly",

        textShadowColor: "orange",
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 6,
    },
    message: {
        textAlignVertical: "center",
        height: "100%",
        fontSize: "25%",
        textAlign: "center",
        color: "white",
        justifyContent: "space-evenly",
    },
    retry: {
        width: height*ICON_SIZE,
        height: height*ICON_SIZE,
        top: height*(.1-ICON_SIZE)/2,
        left: width*.5 - height*ICON_SIZE/2
    }
})

const messages = ["You suck", "Lol", "Your bad", "Sucks", "get good"]

const SLIDE_TIME = 300
const SLIDE_DELAY = 500

export default function EndScreen({setScreen, newHighScore, score})
{
    console.log(newHighScore)
    const [message, setMessage] = useState("")

    const opacityAnim = useRef(new Animated.Value(0)).current

    const messageStrip = useRef(new Animated.Value(1)).current
    const highScoreStrip = useRef(new Animated.Value(1)).current
    const scoreStrip = useRef(new Animated.Value(1)).current
    const retryStrip = useRef(new Animated.Value(1)).current

    useEffect(() => {
        setMessage(messages[Math.floor(Math.random()*messages.length)])

        Animated.timing(
            opacityAnim, {
            toValue: .3,
            duration: .5,
            useNativeDriver: false
          }).start()

        let strips = 0

        // Message Strip
        Animated.timing(
            messageStrip, {
            toValue: 0,
            duration: SLIDE_TIME,
            delay: SLIDE_DELAY + SLIDE_TIME*strips,
            useNativeDriver: false
          }).start()
        strips++;

        // High Score Strip
        if (newHighScore)
        {
            Animated.timing(
                highScoreStrip, {
                toValue: 0,
                duration: SLIDE_TIME,
                delay: SLIDE_DELAY + SLIDE_TIME*strips,
                useNativeDriver: false
              }).start()
              strips++;
        }

        // Score Strip
        Animated.timing(
            scoreStrip, {
            toValue: 0,
            duration: SLIDE_TIME,
            delay: SLIDE_DELAY + SLIDE_TIME*strips,
            useNativeDriver: false
          }).start()
        strips++;

        // Retry Strip
        Animated.timing(
            retryStrip, {
            toValue: 0,
            duration: SLIDE_TIME,
            delay: SLIDE_DELAY + SLIDE_TIME*strips,
            useNativeDriver: false
          }).start()
        strips++;
    }, [])

    const messageLeft = messageStrip.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width]
    })

    const highscoreLeft = highScoreStrip.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width]
    })

    const scoreLeft = scoreStrip.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width]
    })

    const retryLeft = retryStrip.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width]
    })

    return <View style={styles.container}>
        <Animated.View style={[styles.EndGameScreen, {opacity: opacityAnim}]}/>
        <Text style={styles.GameOverText}>Game Over!</Text>
        <View style={styles.spacer}/>

        <Animated.View style={[styles.strip, {left: messageLeft}]}>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>

        {newHighScore? <Animated.View style={[styles.strip, {left: highscoreLeft}]}>
            <Text style={styles.newHighScore}>New High Score !</Text>
        </Animated.View>:null}

        <Animated.View style={[styles.strip, {left: scoreLeft}]}>
            <Text style={styles.message}>{"Score: "+score}</Text>
        </Animated.View>


        {/* Retry Strip */}
        <Animated.View style={[styles.strip, {left: retryLeft}]}>
            <Pressable onPress={() => setScreen("home")}>
                <Image source={require("../images/retryIcon.png")} style={styles.retry}/>
            </Pressable>
        </Animated.View>
    </View>
}
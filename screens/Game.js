import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const PLAYERSIZE = .1

const styles = StyleSheet.create({
    Goal: {
        width: width*.5,
        position: "absolute",
        height: height*.1,
        backgroundColor: "red",
        top: height*.8,
        left: "25%"
    },
    Player: {
        position: "absolute",
        width: width*PLAYERSIZE,
        height: width*PLAYERSIZE,
        borderRadius: '50%',
        borderColor: "black",
        backgroundColor: "#aaa",
        borderWidth: 4
    },
    container: {
        flex: 1,
    },
    ButtonContainer: {
        width: "100%",
        position: "absolute",
        height: height*.1,
        // backgroundColor: "grey",
        top: height*.9,
        flexDirection: "row"
    },
    PositionButtonContainer: {
        flex: 1,
        borderRadius: "50%",
        borderWidth: 2
    },
    PositionButton: {
        // color: "black"
        fontSize: 50,
        textAlign: "center"
    },
    TopText: {
        fontSize: 30,
        textAlign: "center"
    }
});

const Positions = 6
const ButtonRange = [0, 1, 2, 3, 4, 5]

const playerDistance = width*.5
const WideAngle = 120
function getPositionAngle(index)
{
    return (90 + WideAngle/2 - WideAngle/(Positions-2) * index)/180*Math.PI
}

function getAttackerPosition(index)
{
    const startheight = height*.8
    if (index == 5)
        return [width*.5, height*.725]

    const angle = getPositionAngle(index)
    return [Math.cos(angle)*playerDistance + width/2, -Math.sin(angle)*playerDistance+startheight ]
}

const MOVETIME = 250

export default function Game()
{
    const [score, setScore ] = useState(0)
    const [ position, setPosition ] = useState(1)
    const [ actualPos, setActualPos ] = useState([0, 0])

    const attackerLeft = useRef(new Animated.Value(0)).current
    const attackerTop = useRef(new Animated.Value(0)).current

    function OnCheck(index)
    {
        if (index == position)
        {
            setScore(score+1)

            let newPos = Math.floor(Math.random()*6)
            while (newPos == position)
                newPos = Math.floor(Math.random()*6)

            setPosition(newPos)
        }
    }   

    useEffect(() => {
        const newPos = getAttackerPosition(position)
        setActualPos([newPos[0]-width*PLAYERSIZE/2, newPos[1]-width*PLAYERSIZE/2])
    }, [position])

    useEffect(() => {
        Animated.timing(
            attackerLeft,
            {
              toValue: actualPos[0],
              duration: MOVETIME,
              useNativeDriver: false
            }
          ).start();

          Animated.timing(
            attackerTop,
            {
              toValue: actualPos[1],
              duration: MOVETIME,
              useNativeDriver: false
            }
          ).start();
    })

    return <View style={styles.container}>
        <Text style={styles.TopText}>Score:</Text>
        <Text style={styles.TopText}>{score.toString()}</Text>
        {/* Buttons */}
        <View style={styles.ButtonContainer}>
            {ButtonRange.map((index) => <Pressable key={index} onPress={() => OnCheck(index)} style={styles.PositionButtonContainer}>
                <Text style={styles.PositionButton}>{(index+1).toString()}</Text>
            </Pressable>)}
        </View>
        <View style={styles.Goal}/>
        <Animated.View style={[styles.Player, {left: attackerLeft, top: attackerTop}]}/>
        
    </View>
}
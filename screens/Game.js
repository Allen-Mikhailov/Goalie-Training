import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
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
    },
    PositionButton: {
        // color: "black"
        fontSize: 50,
        textAlign: "center"
    },
    TopText: {
        fontSize: 30,
        textAlign: "center"
    },
    Misses: {
        flexDirection: "row",
        width: "100%",
        height: "10%",
        position: "absolute",
        top: "12.5%",
        alignItems: "center",
        justifyContent: "center"
    },
    Miss: {
        width: height*.1,
        height: height*.1,
    },
    bar: {
        width: "10%",
        height: "100%",
        left: "46%",
        backgroundColor: "red",
        flex: 1,
        position: "absolute"
    },
    EndGameScreen: {
        width: "100%",
        height: "100%",
        top: -STATUSBAR_HEIGHT,
        backgroundColor: "grey",
        opacity: .5,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute"
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

function Miss()
{
    return <View style={styles.Miss}>
        <View style={[styles.bar, {transform: [{rotate: "45deg"}]}]}/>
        <View style={[styles.bar, {transform: [{rotate: "-45deg"}]}]}/>
    </View>
}

function Misses({misses})
{
    return <View style={styles.Misses}>
        {misses >= 1? <Miss/>:null}
        {misses >= 2? <Miss/>:null}
        {misses >= 3? <Miss/>:null}
    </View>
}

const MOVETIME = 250

export default function Game({ highscore, setHighscore, setScreen })
{
    const [score, setScore ] = useState(0)
    const [ position, setPosition ] = useState(1)
    const [ actualPos, setActualPos ] = useState([0, 0])
    const [ gameEnd, setGameEnd ] = useState(false)
    const [newHighScore, setNewHighScore] = useState(false)

    const [ misses, setMisses ] = useState(0)

    const attackerLeft = useRef(new Animated.Value(0)).current
    const attackerTop = useRef(new Animated.Value(0)).current

    function OnCheck(index)
    {
        if (gameEnd) return;
        if (index == position)
            setScore(score+1)
        else
            setMisses(misses + 1)

        let newPos = Math.floor(Math.random()*6)
        while (newPos == position)
            newPos = Math.floor(Math.random()*6)
        setPosition(newPos)
    }

    // Game End
    useEffect(() => {
        if (misses == 3)
        {
            // Game End
            if (score > highscore)
            {
                setHighscore(score)
                setNewHighScore(true)
            }
            setGameEnd(true)
        }
    }, [misses])

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
        <Text style={styles.TopText}>{score.toString()}</Text>
        <Misses misses={misses}/>
        {/* Buttons */}
        <View style={styles.ButtonContainer}>
            {ButtonRange.map((index) => <Pressable key={index} onPress={() => OnCheck(index)} style={styles.PositionButtonContainer}>
                <Text style={styles.PositionButton}>{(index+1).toString()}</Text>
            </Pressable>)}
        </View>
        <View style={styles.Goal}/>
        <Animated.View style={[styles.Player, {left: attackerLeft, top: attackerTop}]}/>
        
        {/* End Game Screen */}
        {gameEnd? <View style={styles.EndGameScreen}>
            {newHighScore? <Text>New Highscore!</Text>:null}
            <Text>{"Final Score: "+score}</Text>
            <Button title='Retry' onPress={() => setScreen("home")}/>
        </View>:null}
    </View>
}
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

import { Audio } from 'expo-av';

import Player from '../components/Player';
import Goal from '../components/Goal';

const PLAYER_SIZE = .125

const styles = StyleSheet.create({
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

// Totally Wrote this
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

const playerDistance = width*.5
const defenderDisance = width*.375
const WideAngle = 120
function getPositionAngle(index)
{
    return (90 + WideAngle/2 - WideAngle/(Positions-2) * (4-index))/180*Math.PI
}

function getAttackerPosition(index)
{
    const startheight = height*.8
    if (index == 5)
        return [width*.5, height*.725]

    const angle = getPositionAngle(index)
    return [Math.cos(angle)*playerDistance + width/2, -Math.sin(angle)*playerDistance+startheight ]
}

function getDefenderPosition(index)
{
    const startheight = height*.8
    if (index == 5)
        return [width*.5, height*.725]

    const angle = getPositionAngle(index)
    return [Math.cos(angle)*defenderDisance + width/2, -Math.sin(angle)*defenderDisance+startheight ]
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

export default function Game({ highscore, setHighscore, setScreen })
{
    const [score, setScore ] = useState(0)

    const [ position, setPosition ] = useState(1)
    const [ actualPos, setActualPos ] = useState([0, 0])

    const [ defenderPosIndex, setDefenderPosIndex ] = useState(0)
    const [ defenderPos, setDefenderPos ] = useState([0, 0])

    const [ gameEnd, setGameEnd ] = useState(false)
    const [newHighScore, setNewHighScore] = useState(false)

    const [ misses, setMisses ] = useState(0)

    function OnCheck(index)
    {
        if (gameEnd) return;
        if (index == position)
            setScore(score+1)
        else
            setMisses(misses + 1)

        let newPos = position
        setDefenderPosIndex(position)
        while (position == newPos)
            newPos = Math.floor(Math.random()*6)
        setPosition(newPos)
    }

    // Game Start
    useEffect(() => {
        
    }, [])

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
        setActualPos([newPos[0]-width*PLAYER_SIZE/2, newPos[1]-width*PLAYER_SIZE/2])
    }, [position])

    useEffect(() => {
        const newPos = getDefenderPosition(defenderPosIndex)
        setDefenderPos([newPos[0]-width*PLAYER_SIZE/2, newPos[1]-width*PLAYER_SIZE/2])
    }, [defenderPosIndex])

    return <View style={styles.container}>
        <Text style={styles.TopText}>{score.toString()}</Text>
        <Misses misses={misses}/>
        {/* Buttons */}
        <View style={styles.ButtonContainer}>
            {ButtonRange.map((index) => <Pressable key={index} onPress={() => OnCheck(index)} style={styles.PositionButtonContainer}>
                <Text style={styles.PositionButton}>{(index+1).toString()}</Text>
            </Pressable>)}
        </View>
        <Goal/>

        {/* Attacker */}
        <Player left={actualPos[0]} top={actualPos[1]} style={{backgroundColor: "red"}}/>

        {/* Goalie */}
        <Player left={defenderPos[0]} top={defenderPos[1]} style={{backgroundColor: "lightblue"}}/>
        
        {/* End Game Screen */}
        {gameEnd? <View style={styles.EndGameScreen}>
            {newHighScore? <Text>New Highscore!</Text>:null}
            <Text>{"Final Score: "+score}</Text>
            <Button title='Retry' onPress={() => setScreen("home")}/>
        </View>:null}
    </View>
}
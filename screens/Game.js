import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

import { Audio } from 'expo-av';

const MissSoundObj = require("../sounds/miss.wav")
const CorrectSoundObj = require("../sounds/correct.wav")

import Player from '../components/Player';
import Goal from '../components/Goal';
import EndGameScreen from "../components/EndScreen.js"

const PLAYER_SIZE = .125

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ButtonContainer: {
        width: "100%",
        position: "absolute",
        height: height * .1,
        // backgroundColor: "grey",
        top: height * .9,
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
        width: height * .1,
        height: height * .1,
    },
    bar: {
        width: "10%",
        height: "100%",
        left: "46%",
        backgroundColor: "red",
        flex: 1,
        position: "absolute"
    },
});

const Positions = 6
const ButtonRange = [0, 1, 2, 3, 4, 5]

const STREAK_TIME = 3000

const playerDistance = width * .5
const defenderDisance = width * .375
const WideAngle = 120
function getPositionAngle(index) {
    return (90 + WideAngle / 2 - WideAngle / (Positions - 2) * (4 - index)) / 180 * Math.PI
}

function getAttackerPosition(index) {
    const startheight = height * .8
    if (index == 5)
        return [width * .5, height * .725]

    const angle = getPositionAngle(index)
    return [Math.cos(angle) * playerDistance + width / 2, -Math.sin(angle) * playerDistance + startheight]
}

function getDefenderPosition(index) {
    const startheight = height * .8
    if (index == 5)
        return [width * .5, height * .725]

    const angle = getPositionAngle(index)
    return [Math.cos(angle) * defenderDisance + width / 2, -Math.sin(angle) * defenderDisance + startheight]
}

function Miss() {
    return <View style={styles.Miss}>
        <View style={[styles.bar, { transform: [{ rotate: "45deg" }] }]} />
        <View style={[styles.bar, { transform: [{ rotate: "-45deg" }] }]} />
    </View>
}

function Misses({ misses }) {
    return <View style={styles.Misses}>
        {misses >= 1 ? <Miss /> : null}
        {misses >= 2 ? <Miss /> : null}
        {misses >= 3 ? <Miss /> : null}
    </View>
}

export default function Game({ highscore, setHighscore, setScreen }) {
    const [score, setScore] = useState(0)

    const [position, setPosition] = useState(1)
    const [actualPos, setActualPos] = useState([0, 0])

    const [defenderPosIndex, setDefenderPosIndex] = useState(0)
    const [defenderPos, setDefenderPos] = useState([0, 0])

    const [gameEnd, setGameEnd] = useState(false)
    const [newHighScore, setNewHighScore] = useState(false)

    const [misses, setMisses] = useState(0)

    const [missSound, setMissSound] = useState()
    const [correctSound, setCorrectSound] = useState()

    const streakAnim = useRef(new Animated.Value(1)).current
    const [streak, setStreak] = useState(0)
    const [lastHit, setLastHit] = useState(0)

    async function playCorrectSound() {
        const { sound } = await Audio.Sound.createAsync(CorrectSoundObj);
        setCorrectSound(sound);
        sound.setPositionAsync(50)

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function playMissSound() {
        const { sound } = await Audio.Sound.createAsync(MissSoundObj);
        setMissSound(sound);
        sound.setPositionAsync(150)

        console.log('Playing Sound');
        await sound.playAsync();
    }

    useEffect(() => {
        return missSound
            ? () => {
                console.log('Unloading Sound');
                missSound.unloadAsync();
            }
            : undefined;
    }, [missSound]);

    useEffect(() => {
        return correctSound
            ? () => {
                console.log('Unloading Sound');
                correctSound.unloadAsync();
            }
            : undefined;
    }, [correctSound]);

    function OnCheck(index) {
        if (gameEnd) return;
        if (index == position) {
            playCorrectSound()
            setScore(score + 1)

            if (Date.now() - lastHit < STREAK_TIME) {
                setStreak(streak + 1)
            } else {
                setStreak(1)
            }
            setLastHit(Date.now())
        }
        else {
            playMissSound()
            setMisses(misses + 1)
            setStreak(0)
        }

        let newPos = position
        setDefenderPosIndex(position)
        while (position == newPos)
            newPos = Math.floor(Math.random() * 6)
        setPosition(newPos)
    }

    // Game Start
    useEffect(() => {

    }, [])

    // Game End
    useEffect(() => {
        if (misses == 3) {
            // Game End
            if (score > highscore) {
                setHighscore(score)
                setNewHighScore(true)
            }
            setGameEnd(true)
        }
    }, [misses])

    useEffect(() => {
        const newPos = getAttackerPosition(position)
        setActualPos([newPos[0] - width * PLAYER_SIZE / 2, newPos[1] - width * PLAYER_SIZE / 2])
    }, [position])

    useEffect(() => {
        const newPos = getDefenderPosition(defenderPosIndex)
        setDefenderPos([newPos[0] - width * PLAYER_SIZE / 2, newPos[1] - width * PLAYER_SIZE / 2])
    }, [defenderPosIndex])

    // Streak Animation
    useEffect(() => {
        if (streak == 0) return;
        console.log(streak)

        Animated.sequence([
            Animated.timing(streakAnim,
                {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false
                }),
            Animated.timing(streakAnim,
                {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: false
                }),
        ]).start()
    }, [streak])

    return <View style={styles.container}>
        <Text style={styles.TopText}>{score.toString()}</Text>
        <Animated.Text style={[styles.TopText, {
            opacity: Animated.subtract(1, streakAnim)
        }]}>{"+"+streak}</Animated.Text>
        <Misses misses={misses} />
        {/* Buttons */}
        <View style={styles.ButtonContainer}>
            {ButtonRange.map((index) => <Pressable key={index} onPress={() => OnCheck(index)} style={styles.PositionButtonContainer}>
                <Text style={styles.PositionButton}>{(index + 1).toString()}</Text>
            </Pressable>)}
        </View>
        <Goal />

        {/* Attacker */}
        <Player left={actualPos[0]} top={actualPos[1]} style={{ backgroundColor: "red" }} />

        {/* Goalie */}
        <Player left={defenderPos[0]} top={defenderPos[1]} style={{ backgroundColor: "lightblue" }} />

        {/* End Game Screen */}
        {gameEnd? <EndGameScreen 
            setScreen={setScreen} 
            score={score} 
            newHighScore={newHighScore}
        />:null}
    </View>
}
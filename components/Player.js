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
    trail: {
      width: 34,
      height: 4,
      position: "relative",
      left: PLAYER_SIZE/2*width - 1,
      backgroundColor: "black"

    },
    leftTrail: {
      top: -4
    },
    rightTrail: {
      top: width * PLAYER_SIZE/2+6
    }
})

export default function Player({left, top, style})
{
    const [lastLeft, setLastLeft] = useState(0)
    const [lastTop, setLastTop] = useState(0)

    const [currentLeft, setCurrentLeft] = useState(0)
    const [currentTop, setCurrentTop] = useState(0)

    const animatedLeft = useRef(new Animated.Value(0)).current
    const animatedTop = useRef(new Animated.Value(0)).current

    useEffect(() => {
      setLastLeft(currentLeft)
      setLastTop(currentTop)

      setCurrentLeft(left)
      setCurrentTop(top)

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

    const animatedStyle = {
      left: animatedLeft, 
      top: animatedTop, 
      transform: [{rotate: Math.atan2(lastTop-top, lastLeft-left)+"rad"}]}


    return <Animated.View style={[styles.Player, animatedStyle, style]}>
      <Animated.View style={[styles.trail, styles.leftTrail]}/>
      <Animated.View style={[styles.trail, styles.rightTrail]}/>
    </Animated.View>
}
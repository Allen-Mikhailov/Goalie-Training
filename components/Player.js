import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Pressable, Animated, Button } from 'react-native';
import { useState, useEffect, useRef } from 'react';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

const MOVE_TIME = 500
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

function pytha(x1, y1, x2, y2)
{
  return Math.sqrt( (x1-x2)**2 + (y1-y2)**2 )
}

function abs(a) {
  const b = Animated.multiply(a, -1);
  const clampedA = Animated.diffClamp(a, 0, Number.MAX_SAFE_INTEGER);
  const clampedB = Animated.diffClamp(b, 0, Number.MAX_SAFE_INTEGER);

  return Animated.add(clampedA, clampedB);
};

export default function Player({left, top, style})
{
    const [lastLeft, setLastLeft] = useState(1)
    const [lastTop, setLastTop] = useState(1)

    const [currentLeft, setCurrentLeft] = useState(0)
    const [currentTop, setCurrentTop] = useState(0)

    const alpha = useRef(new Animated.Value(0)).current

    useEffect(() => {
      setLastLeft(currentLeft)
      setLastTop(currentTop)

      setCurrentLeft(left)
      setCurrentTop(top)

        Animated.timing(
          alpha,
            {
              toValue: 0,
              duration: .0,
              useNativeDriver: false
            }
          ).start();

          Animated.timing(
            alpha,
            {
              toValue: 1,
              duration: MOVE_TIME,
              useNativeDriver: false
            }
          ).start();
    }, [left, top])

    const animatedStyle = {
      left: Animated.add(Animated.multiply(alpha, left-lastLeft), lastLeft), 
      top: Animated.add(Animated.multiply(alpha, top-lastTop), lastTop), 
      transform: [{rotate: Math.atan2(lastTop-top, lastLeft-left)+"rad"}]}

      const ialpha = alpha.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [0, 1, 0]
      });

      const trailStyle = {
        width: Animated.multiply(ialpha, 25)
      }

    return <Animated.View style={[styles.Player, animatedStyle, style]}>
      <Animated.View style={[styles.trail, styles.leftTrail, trailStyle]}/>
      <Animated.View style={[styles.trail, styles.rightTrail, trailStyle]}/>
    </Animated.View>
}
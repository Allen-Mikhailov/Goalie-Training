import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions, Image, Animated } from 'react-native';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
      },
      bubble: {
        position: "absolute",
        borderRadius: "100%",
        backgroundColor: "#82D0F3"
      }
})

const startingColor = 0xBDE8FB
const endingColor = 0x82D0F3

function Bubble()
{
  const animation = useRef(new Animated.Value(-1)).current
  const [stats, setStats ] = useState({
    x: 0,
    y: 0,
    direction: 0,
    weight: 0,
    offset: 0,
    speed: 1000,
    size: 0
  })

  useEffect(() => {
    const newSize = width*(Math.random()*.3+.1)

    const newStats = {
      x: Math.random()*(newSize+width) - newSize,
      y: Math.random()*(newSize+height) - newSize,
      direction: Math.random()*2*Math.PI,
      weight: Math.random()*50+10,
      offset: 0,
      speed: Math.random()*50000+5000,
      size: newSize
    }
    setStats(newStats)

    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: newStats.speed,
          useNativeDriver: false
        }),
        Animated.timing(animation, {
          toValue: -1,
          duration: newStats.speed,
          useNativeDriver: false
        }),
      ]),
      {}
    ).start()
  }, [])

  const animatedStyle = {
    left: Animated.add(stats.x, Animated.multiply(animation, Math.cos(stats.direction)*stats.weight)),
    top: Animated.add(stats.y, Animated.multiply(animation, Math.sin(stats.direction)*stats.weight)),
    width: stats.size,
    height: stats.size
  }

  return <Animated.View style={[styles.bubble, animatedStyle]}/>
}

export default function Background()
{
    return <Animated.View style={[styles.background]}>
      {Array.from({ length: 15 }, (_, i) => <Bubble key={i}/>)}
    </Animated.View>
}
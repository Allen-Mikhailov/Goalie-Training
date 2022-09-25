import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { useState, useEffect } from 'react';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0
      }
})

export default function Background()
{
    
}
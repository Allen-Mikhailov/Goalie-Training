import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    HighscoreContainer: {
        position: "absolute",
        width: "10%",
        height: "5%",
        left: "2%",
        // backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center"
    },
    trophyIcon: {
        width: 30,
        height: 30
    },
    HighscoreText: {
        fontSize: 30
    }
})

export default function HighscoreDisplay({highscore})
{
    return <View style={styles.HighscoreContainer}>
        <Image
        style={styles.trophyIcon}
        source={require('../images/trophy.png')}
      />
      <Text style={styles.HighscoreText}>{highscore}</Text>
    </View>
}
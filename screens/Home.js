import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native';

import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height - STATUSBAR_HEIGHT

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50
    },
    playButtonContainer: {
        width: width * .175,
        height: width * .175,
        top: height*.7,
        position: "absolute",
        backgroundColor: 'black',
        borderRadius: "50%"
    },
    playButton: {
        width: "80%",
        height: "80%",
        left: "10%",
        top: "10%",
        color: "white"
    }
});

export default function Home({ setScreen }) {
    return <View style={styles.container}>
        <Text style={styles.title}>Goalie Training</Text>
        <Pressable style={styles.playButtonContainer} onPress={() => setScreen("game")}>
            <Image style={styles.playButton} source={require('../images/play.png')} />
        </Pressable>
        {/* <Button title='Play' onPress={() => setScreen("game")}/> */}
    </View>
}
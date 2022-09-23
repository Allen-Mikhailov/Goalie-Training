import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default function Home({setScreen})
{
    return <View style={styles.container}>
        <View>
            <Button title='Play' onPress={() => setScreen("game")}/>
        </View>

    </View>
}
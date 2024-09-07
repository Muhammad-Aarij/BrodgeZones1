import React, { useEffect } from 'react';
import { StyleSheet, View, Text , Image } from 'react-native';
import LottieView from 'lottie-react-native';
import away from '../Images/away.png'

export default function CustomModal({ img, message }) {
    console.log("img" + img);
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.maincontainer]}>
            <View style={styles.modal}>
                <Image
                    style={styles.animation}
                    source={away}
                />
                <Text style={styles.text}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        width: 250, height: 250,
        padding: 10,
        paddingVertical:25,
        borderRadius: 10,
        elevation: 5,
        flexDirection: "column",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        marginTop: 5,
        textAlign: 'center',
        color: "#71797E",
    },
    animation: {
        width: 150,
        height: 150,
        // marginBottom: 10,
    },
});

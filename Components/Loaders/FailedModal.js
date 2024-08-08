import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function FailedModal({ message, onClose }) {
  

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.maincontainer]}>
            <View style={styles.modal}>
                <LottieView
                    style={styles.animation}
                    source={require('../Images/failed.json')}
                    autoPlay
                    loop={false} // Make sure the animation does not loop
                />
                <Text style={styles.text}>Try Again...</Text>
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
        borderRadius: 10,
        elevation: 5,
        flexDirection: "column",
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        marginBottom:20,
        textAlign: 'center',
        color:"#71797E"
    },
    animation: {
        width: 180,
        height: 180,
        // marginBottom: 10,
    },
});

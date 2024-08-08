import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';

export default function Loader() {
    return (
        <LottieView
            style={styles.animation}
            source={require('../Images/loading.json')}
            autoPlay
            loop={true} // Ensure the animation does not loop
        />
    );
}

const styles = StyleSheet.create({
    animation: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
});

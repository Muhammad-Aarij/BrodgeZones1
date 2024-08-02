import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SuccessModal({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Duration of the animation

        return () => clearTimeout(timer); // Clear timer if component unmounts
    }, [onClose]);

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.maincontainer]}>
            <View style={styles.modal}>
                <LottieView
                    style={styles.animation}
                    source={require('../Images/Animation - 1722580375836.json')}
                    autoPlay
                    loop={false} // Make sure the animation does not loop
                />
                <Text style={{ ...styles.text, fontWeight: "bold" }}>Successful</Text>
                <Text style={styles.text}>Attendance Marked</Text>
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
        textAlign: 'center',
    },
    animation: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
});

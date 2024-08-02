import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import LoaderKit from 'react-native-loader-kit';

const LoaderModal = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
        >
            <View style={styles.modalBackground}>
                <View style={styles.loaderContainer}>
                    <LoaderKit
                        style={styles.loader}
                        name={'SemiCircleSpin'}
                        color={'#4BAAC8'}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loaderContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 10,
    },
    loader: {
        width: 50,
        height: 50,
    },
});

export default LoaderModal;

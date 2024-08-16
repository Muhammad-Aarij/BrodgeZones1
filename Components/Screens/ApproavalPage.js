import React from 'react'
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native'


const { width } = Dimensions.get('window');

export default function ApproavalPage() {
    return (
        <View style={styles.maincontainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Muhammad Ali</Text>
            </View>

            <View style={styles.info}>
                <View style={styles.infotile}>
                    <Text style={styles.txt}>Applied Date</Text>
                    <Text style={styles.txtlight}>25/4/512</Text>
                </View>
                <View style={styles.infotile}>
                    <Text style={styles.txt}>From</Text>
                    <Text style={styles.txtlight}>25/4/512</Text>
                </View>
                <View style={styles.infotile}>
                    <Text style={styles.txt}>To</Text>
                    <Text style={styles.txtlight}>23/4/512</Text>
                </View>
                <View style={styles.infotile}>
                    <Text style={styles.txt}>Leave Type</Text>
                    <Text style={styles.txtlight}>Medical</Text>
                </View>
                <View style={styles.infotile}>
                    <Text style={styles.txt}>Document</Text>
                    <Text style={styles.txtlight}>---</Text>
                </View>

            </View>
            <View style={styles.btncontainer}>
                <TouchableOpacity  style={{...styles.btn,backgroundColor:"#de3e1e"}}>
                    <Text style={styles.btntxt}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={{...styles.btn,backgroundColor:"#79b433"}}>
                    <Text style={styles.btntxt}>Approave</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    maincontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    title: {
        fontSize: width * 0.065,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    info: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: "rgba(241, 241, 241, 1)",
        // marginBottom: 10,
        padding: 15,
        paddingHorizontal:25,
        borderRadius: 10,
    },
    infotile: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        height: 50,
    },
    txt: {
        fontSize: width * 0.037,
        fontFamily: "sans-serif-medium",
        color: "rgba(18, 18, 18, 1)",
        fontWeight:"400",
    },


    txtlight: {
        fontSize: width * 0.033,
        fontFamily: "sans-serif-regular",
        fontWeight:"700",
        color: "#808080",


    },
    btncontainer: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: "rgba(18, 18, 18, 1)",
        // borderRadius: 10,
        // padding: 10,
    },
    btn: {
        width: width * 0.4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "rgba(241, 241, 241, 1)",
        // marginBottom: 3,
    },
    btntxt: {
        fontSize: width * 0.032,
        fontFamily: "sans-serif-regular",
        color: "white",
        // marginBottom: 3,
    },
})
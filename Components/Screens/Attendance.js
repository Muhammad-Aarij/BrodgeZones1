import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import bg from '../Images/bg.png'
import attendance from '../Images/calendar2.png'
import info from '../Images/info.png'
import mappin from '../Images/map-pin.png'
import qr from '../Images/qr-code.png'

export default function Attendance({navigation}) {

    return (
        <ImageBackground source={bg} style={styles.maincontainer}>
            <Text style={styles.heading}>Attendance </Text>
            <View style={styles.tilesContainer}>
                <TouchableOpacity style={styles.tile} onPress={()=>{
                    navigation.navigate("AttendanceHistory")
                }}>
                    <Image style={styles.img} source={attendance}></Image>
                    <Text style={styles.txt}>Attendance</Text>
                    <Text style={styles.txt}>Record</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tile}>
                    <Image style={styles.img} source={mappin}></Image>
                    <Text style={styles.txt}>GPS IN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tile}>
                    <Image style={styles.img} source={qr}></Image>
                    <Text style={styles.txt}>QR Code</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tile}>
                    <Image style={styles.img} source={info}></Image>
                    <Text style={styles.txt}>Information</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.txt}>2022 BridgeZones</Text>
                <Text style={styles.txt}>All rights reserved</Text>
            </View>

        </ImageBackground>
    )
}


const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tilesContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tile: {
        width: 140,
        height: 180,
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4BAAC8',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    img: {
        width: 45,
        height: 45,
        marginBottom:15,
        resizeMode: 'contain',
    },
    txt: {
        fontSize: 15,
        color: "white",
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 50,
    },
    footer: {
        backgroundColor: '#4BAAC8',
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginTop: 20,
        color: 'white',
        // borderRadius:5,
        // marginBottom:1,
    }



})
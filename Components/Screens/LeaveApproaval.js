import React from 'react'
import { Dimensions, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper';
import bell from '../Images/bell.png'
import emergency from '../Images/emergency.png'
import medical from '../Images/medical.png'
import casual from '../Images/casual.png'
const { width } = Dimensions.get('window');

export default function LeaveApproaval({navigation}) {
    return (
        <View style={styles.maincontainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Notification's</Text>
            </View>
            <View style={styles.datecontainer}>
                <Text style={styles.date}>Today</Text>
                <View style={styles.tilecontainer}>
                    <TouchableOpacity style={styles.tile}  onPress={()=>{
                        navigation.navigate('ApproavalPage');
                    }}>
                        <View style={styles.tileleft}>
                            <Image style={styles.img} source={emergency}></Image>
                        </View>
                        <View style={styles.tileright}>
                            <Text style={styles.heading}>Muhammad Ali</Text>
                            <Text style={styles.content}>Emergency Leave Request</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.tile}>
                        <View style={styles.tileleft}>
                            <Image style={styles.img} source={casual}></Image>
                        </View>
                        <View style={styles.tileright}>
                            <Text style={styles.heading}>Muhammad Asim</Text>
                            <Text style={styles.content}>Casual Leave Request</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.datecontainer}>
                <Text style={styles.date}>Yesterday</Text>
                <View style={styles.tilecontainer}>
                    <View style={styles.tile}>
                        <View style={styles.tileleft}>
                            <Image style={styles.img} source={casual}></Image>
                        </View>
                        <View style={styles.tileright}>
                            <Text style={styles.heading}>Muhammad Asim</Text>
                            <Text style={styles.content}>Casual Leave Request</Text>
                        </View>
                    </View>
                    <View style={styles.tile}>
                        <View style={styles.tileleft}>
                            <Image style={styles.img} source={medical}></Image>
                        </View>
                        <View style={styles.tileright}>
                            <Text style={styles.heading}>Sarmad Ali </Text>
                            <Text style={styles.content}> Medical Leave Request</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: width*0.05,
    },
    header: {
        width: '100%',
        height: width*0.18,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: width*0.025,
        marginTop: width*0.025,
    },
    title: {
        fontSize: width*0.065,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    datecontainer: {

        marginTop: width*0.01,
        // marginBottom: 5,
        // paddingTop:13,
        padding: width*0.01,
        backgroundColor: '#fff',

    },
    date: {
        paddingBottom: width*0.012,
        fontFamily: "sans-serif-black",
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: "rgba(51, 51, 51, 1)",
    },
    tilecontainer: {
        padding: width*0.025,
        backgroundColor: '#fff',
        gap: width*0.02,
        // borderWidth: 1,
        // borderColor: '#ccc',
    },
    tile: {
        backgroundColor: "rgba(241, 241, 241, 1)",
        flexDirection: 'row',
        marginBottom: width*0.02,
        padding: width*0.013,
        borderRadius: width*0.04,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
    tileleft: {
        width: width*0.12,
        height: width*0.12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: width*0.025,
        margin:width*0.005,
        backgroundColor: "#FFFFFF",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
    },
    img: {
        width: width*0.06,
        height: width*0.06,
    },
    tileright: {
        flex: 1,
        marginLeft: width*0.03,
    },
    heading: {
        fontSize: width * 0.037,
        fontFamily: "sans-serif-black",
        color: "rgba(18, 18, 18, 1)",
        fontWeight: 'bold',
        marginBottom: width*0.01,
    },
    content: {
        fontSize: width * 0.033,
    },

})
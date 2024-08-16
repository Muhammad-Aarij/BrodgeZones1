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
        fontSize: width*0.065,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    datecontainer: {

        marginTop: 5,
        // marginBottom: 5,
        // paddingTop:13,
        padding: 5,
        backgroundColor: '#fff',

    },
    date: {
        paddingBottom: 5,
        fontFamily: "sans-serif-black",
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: "rgba(51, 51, 51, 1)",
    },
    tilecontainer: {
        padding: 10,
        backgroundColor: '#fff',
        gap: 15,
        // borderWidth: 1,
        // borderColor: '#ccc',
    },
    tile: {
        backgroundColor: "rgba(241, 241, 241, 1)",
        flexDirection: 'row',
        marginBottom: 10,
        padding: 6,
        borderRadius: 15,
        alignItems: "center",
    },
    tileleft: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin:2,
        backgroundColor: "#FFFFFF",
    },
    img: {
        width: 25,
        height: 25,
    },
    tileright: {
        flex: 1,
        marginLeft: 12,
    },
    heading: {
        fontSize: width * 0.037,
        fontFamily: "sans-serif-black",
        color: "rgba(18, 18, 18, 1)",
        fontWeight: 'bold',
        marginBottom: 3,
    },
    content: {
        fontSize: width * 0.033,
    },

})
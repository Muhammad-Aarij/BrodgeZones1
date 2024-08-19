import React from 'react'
import { StyleSheet, Dimensions, Text, View, TouchableOpacity, Image } from 'react-native'
import user from '../Images/nouser.jpg'
import menu from '../Images/menu.png'
import docs from '../Images/docs.png'
import calendar from '../Images/calendar.png'
import approave from '../Images/approve.png'
import reject from '../Images/reject.png'

const { width } = Dimensions.get('window');

export default function ApproavalPage() {
    return (
        <View style={styles.maincontainer}>
            <View style={styles.header}>
                <Image source={user} style={styles.img}></Image>
                <Text style={styles.title}>Muhammad Ali</Text>
            </View>

            <View style={styles.info}>
                <View style={styles.infotile}>
                    <Text style={styles.txt}>Applied Date</Text>
                    <Text style={styles.txtlight}>25/4/512</Text>
                </View>
                <View style={styles.infotile}>
                    <View style={styles.infotileleft}>
                        <Image source={calendar} style={styles.smallimg}></Image>
                        <Text style={styles.txt}>From</Text>
                    </View>
                    <Text style={styles.txtlight}>25/4/512</Text>
                </View>
                <View style={styles.infotile}>
                    <View style={styles.infotileleft}>
                        <Image source={calendar} style={styles.smallimg}></Image>
                        <Text style={styles.txt}>To</Text>
                    </View>
                    <Text style={styles.txtlight}>23/4/512</Text>
                </View>
                <View style={styles.infotile}>
                    <View style={styles.infotileleft}>
                        <Image source={menu} style={styles.smallimg}></Image>
                        <Text style={styles.txt}>Leave Type</Text>
                    </View>
                    <Text style={styles.txtlight}>Medical</Text>
                </View>
                <View style={styles.infotile}>
                    <View style={styles.infotileleft}>
                        <Image source={docs} style={styles.smallimg}></Image>
                        <Text style={styles.txt}>Document</Text>
                    </View>
                    <Text style={styles.txtlight}>---</Text>
                </View>

            </View>
            <View style={styles.btncontainer}>
                <TouchableOpacity style={{ ...styles.btn, backgroundColor: "#de3e1e", width: width * 0.3 }}>
                    <Image source={reject} style={styles.smallimg}></Image>
                    <Text style={styles.btntxt}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.btn, backgroundColor: "#79b433" }}>
                    <Image source={approave} style={styles.smallimg}></Image>
                    <Text style={styles.btntxt}>Approave</Text>
                </TouchableOpacity>
            </View>
        </View >
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
        height: 45,
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
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    infotile: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        height: 50,
        
        borderBottomWidth:0.5,
        borderBottomColor: '#ccc',
    },
    infotileleft: {
        // width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        height: 34,
        // borderWidth:2,
    },
    txt: {
        fontSize: width * 0.037,
        fontFamily: "sans-serif-medium",
        color: "rgba(18, 18, 18, 1)",
        fontWeight: "400",
        marginBottom: 3,
    },


    txtlight: {
        fontSize: width * 0.033,
        fontFamily: "sans-serif-regular",
        fontWeight: "700",
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
        flexDirection:"row",
        width: width * 0.4,
        paddingVertical:7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        // borderWidth: 1,
        borderColor: "rgba(241, 241, 241, 1)",
        // marginBottom: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    btntxt: {
        fontSize: width * 0.032,
        fontFamily: "sans-serif-regular",
        color: "white",
        // borderWidth: 3,
    },
    img: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: 50,
        marginRight: 10,
        borderColor: "rgba(241, 241, 241, 1)",
        overflow: 'hidden',
        resizeMode: 'cover',
        alignSelf: 'flex-start',
    },
    smallimg: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: 10,
        borderColor: "rgba(241, 241, 241, 1)",
        overflow: 'hidden',
        resizeMode: 'cover',
        // alignSelf: 'flex-start',

    },
})
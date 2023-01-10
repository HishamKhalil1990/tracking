import { useEffect, useState } from "react";
// import { Text, View, StyleSheet, TouchableOpacity, Linking, Platform, TextInput, ScrollView } from "react-native"
import { Text, View, StyleSheet, TouchableOpacity, Platform, TextInput, ScrollView } from "react-native"
import api from "../../api/api";
import Loader from "./Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import theme from "../../utils/theme"
import {showLocation} from 'react-native-map-link'
import * as Linking from 'expo-linking'

export default DetailLayout = ({ route, navigation }) => {

    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkStorage = async () => {
          let user = await AsyncStorage.getItem("user");
          user = JSON.parse(user);
          setToken(user.token);
        };
        checkStorage();
      }, []);

    const openAddressOnMap = () => {
        // showLocation({
        //     latitude: route.params.data.destination.lat,
        //     longitude: route.params.data.destination.long,
        //     appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
        //     directionsMode: 'car', // optional, accepted values are 'car', 'walk', 'public-transport' or 'bike'
        //   });
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
          });
          const latLng = `${route.params.data.destination.lat},${route.params.data.destination.long}`;
          const label = route.params.data.name;
          const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
          });
        openExternalApp(url);
    };
    
    const openExternalApp = (url) => {
        Linking.openURL(url);
        // Linking.canOpenURL(url).then(supported => {
        //     if (supported) {
        //     } else {
        //     Alert.alert(
        //         'ERROR',
        //         'Unable to open: ' + url,
        //         [
        //         {text: 'OK'},
        //         ]
        //     );
        //     }
        // });
    }

    const sendStatus = async(status) => {
        setIsLoading(true);
        api
        .send(token,status)
        .then((results) => {
            setIsLoading(false);
            if (results.status == "success") {
                alert(results.msg)
                if(status == 'finished'){
                    route.params.setOrderNo(route.params.index)
                    navigation.goBack()
                }
            } else if (results.status == "unauthorized"){
            AsyncStorage.clear()
            alert(
                "انتهت الجلسة الرجاء اعادة الدخول مرة اخرى"
            );
            navigation.replace('Auth')
            }
        })
        .catch((num) => {
            setIsLoading(false);
            if (num == 1) {
            alert("حدث خطا ما الرجاء المحاولة مرة اخرى");
            } else {
            alert("الرجاء التاكد من الاتصال بالانترنت");
            }
        });
    }

    return (
        <ScrollView>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor:'#EEEEEE'
                }}
                >
                <Loader loading={isLoading} />
                <View
                    style={{
                        marginTop:25,
                        height:'40%',
                        width:'80%',
                        backgroundColor:'#fff',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                        borderRadius:10
                    }}
                >
                    <View style={styles.detail}>
                        <Text style={[styles.text2]}>
                            {route.params.data.name}
                        </Text>
                        <Text style={[styles.text3]}>
                            no: {route.params.data.no}
                        </Text>
                    </View>
                    <TextInput 
                        value={route.params.data.description}
                        editable={false}
                        multiline={true}
                        numberOfLines={20}
                        style={{
                            height:'85%',
                            width:'100%',
                            backgroundColor:'#fff',
                            textAlign:'right',
                            textAlignVertical:'top',
                            color:'black',
                            fontSize:15,
                            fontWeight:'bold',
                            paddingTop:25,
                            paddingRight:10,
                            paddingLeft:10,
                            paddingBottom:10,
                            borderBottomLeftRadius:10,
                            borderBottomRightRadius:10
                        }}
                    />
                </View>
                <View
                    style={{
                        marginTop:40,
                        width:'80%',
                        maxHeight:70,
                        flex: 1,
                        flexDirection:'row-reverse',
                        justifyContent:'space-between',
                        backgroundColor: 'white',
                        borderBottomWidth:2,
                        borderBottomColor:'#EEEEEE'
                    }}
                >
                    <View style={styles.viewText}>
                        <Text style={styles.text}>
                            الذهاب
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button,{backgroundColor:"#5BC0F8"}]}
                        onPress={openAddressOnMap}
                    >
                        <Foundation name="map" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width:'80%',
                        maxHeight:70,
                        flex: 1,
                        flexDirection:'row-reverse',
                        justifyContent:'space-between',
                        backgroundColor: 'white',
                        borderBottomWidth:2,
                        borderBottomColor:'#EEEEEE'
                    }}
                >
                    <View style={styles.viewText}>
                        <Text style={styles.text}>
                            وصلت
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button,{backgroundColor:'#379237'}]}
                        onPress={() => {sendStatus('arrived')}}
                    >
                        <MaterialCommunityIcons name="map-marker-check" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width:'80%',
                        maxHeight:70,
                        flex: 1,
                        flexDirection:'row-reverse',
                        justifyContent:'space-between',
                        backgroundColor: 'white',
                    }}
                >
                    <View style={styles.viewText}>
                        <Text style={styles.text}>
                            انتهيت
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.button,,{backgroundColor:'#FF6D28'}]}
                        onPress={() => {sendStatus('finished')}}
                    >
                        <MaterialIcons name="done-all" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewText:{
        width:'75%',
        height:70,
        flex: 1,
        flexDirection:'row-reverse',
        alignItems: "center",
        justifyContent:'center',
    },
    text:{
        fontWeight: 'bold',
        fontSize:15,
        marginTop:5,
        marginBottom:5,
        textAlign:'center',
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#5BC0F8",
        padding: 10,
        width:'25%',
        height:70
    },
    btuText:{
        fontSize:20,
        color:'#fff'
    },
    text2:{
        fontWeight: 'bold',
        fontSize:15,
        marginRight:10,
        textAlign:'right',
    },
    text3:{
        fontWeight: 'bold',
        fontSize:15,
        marginLeft:10,
        textAlign:'right',
    },
    detail:{
        marginTop:5,
        width:'100%',
        height:'15%', 
        flex: 1,
        flexDirection:'row-reverse',
        alignItems: "center",
        justifyContent:'space-between',
        borderBottomWidth:2,
        borderBottomColor:'black',
    }
})
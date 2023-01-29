import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Platform, TextInput, ScrollView, Dimensions } from "react-native"
import api from "../../api/api";
import Loader from "./Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import theme from "../../utils/theme"
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking'
import { SwiperFlatList } from "react-native-swiper-flatlist"

const widowWidth = Dimensions.get('window').width;
const viewWidth = 0.8*widowWidth;
let intervalID;
let counter = 1;

export default DetailLayout = ({ route, navigation }) => {

    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mapInd, setMapInd] = useState(0);
    const [orderNo, setOrderNo] = useState(route.params.data.no);
    const [url, setUrl] = useState()

    const swipeRef = useRef()
    const mapSwipeRef = useRef()

    useEffect(() => {
        const checkStorage = async () => {
          let user = await AsyncStorage.getItem("user");
          user = JSON.parse(user);
          setToken(user.token);
        };
        checkStorage();
        (async () => {
            let location = await Location.getCurrentPositionAsync({});
            setUrl(`https://www.google.es/maps/dir/'${location.coords.latitude},${location.coords.longitude}'/'${route.params.data.destination.lat},${route.params.data.destination.long}'`)
        })();
        return () => {
            emptyInterval()
        }
    }, []);

    const startSendLocation = (index) => {
        swipeRef.current.scrollToIndex({index})
        if(index == 1){
            if(!intervalID){
                intervalID = setInterval(() => {
                    (async () => {
                        let location = await Location.getCurrentPositionAsync({});
                        const long = location.coords.longitude;
                        const lat = location.coords.latitude
                        console.log(long,lat)
                    })();
                },5000)
            }
        }else if(index == 0){
            if(intervalID){
                clearInterval(intervalID)
                intervalID = undefined
            }
        }
    }

    const emptyInterval = () => {
        if(intervalID){
            clearInterval(intervalID)
            intervalID = undefined
        }
    }

    const toggleMap = () => {
        const currInd = mapSwipeRef.current.getCurrentIndex()
        if(currInd == 0){
            mapSwipeRef.current.scrollToIndex({index:1})
            setMapInd(1)
        }else if(currInd == 1){
            mapSwipeRef.current.scrollToIndex({index:0})
            setMapInd(0)
        }
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
                        height:'65%',
                        width:'100%',
                    }}
                >
                    <SwiperFlatList
                        ref={mapSwipeRef}
                        disableGesture={true}
                    >
                        <View
                            style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center',marginTop:25,}}
                        >
                            <View
                                style={{
                                    height:'100%',
                                    width:viewWidth,
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
                        </View>
                        {url?
                            <WebView
                                style={{
                                    height:'100%',
                                    width:widowWidth,
                                }}
                                geolocationEnabled={true}
                                source={{uri:url}}
                                onShouldStartLoadWithRequest={event => {
                                    if (event.url.match(/(goo\.gl\/maps)|(maps\.app\.goo\.gl)/) ) {
                                       Linking.openURL(event.url)
                                       return false
                                         }
                                          return true
                                              
                                       }}
                                >
                            </WebView>
                        :
                            <View
                                style={{
                                    height:'100%',
                                    width:widowWidth,
                                    flex:1,justifyContent:'center',
                                    alignItems:'center',
                                    backgroundColor:'#fff'
                                }}
                            >
                                <Text>
                                    Loading
                                </Text>
                            </View>
                        }
                    </SwiperFlatList>
                </View>
                <View
                    style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center',maxHeight:10,marginTop:10}}  
                >
                    <TouchableOpacity
                        style={[styles.button2,{backgroundColor:'gray'}]}
                        onPress={() => {
                            toggleMap()
                        }}
                    >
                        {mapInd == 0?
                            <FontAwesome5 name="map-marked-alt" size={30} color="#fff" />
                        :
                            <MaterialIcons name="description" size={30} color="#fff" />
                        }
                    </TouchableOpacity>
                </View>
                <View
                    style={{width:'100%', marginTop:0,zIndex:0}}
                >   
                    <SwiperFlatList
                        style={{height:140}}
                        showPagination
                        paginationActiveColor={theme.colors.general}
                        index={2}
                        ref={swipeRef}
                    >
                        <View
                            style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center'}}
                        >
                            <View
                                style={{
                                    width:viewWidth,
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
                                    onPress={() => {
                                        emptyInterval(),
                                        sendStatus('finished')
                                    }}
                                >
                                    <MaterialIcons name="done-all" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center'}}
                        >
                            <View
                                style={{
                                    width:viewWidth,
                                    maxHeight:70,
                                    flex: 1,
                                    flexDirection:'row-reverse',
                                    justifyContent:'space-between',
                                    backgroundColor: 'white',
                                }}
                            >
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>
                                        وصلت
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.button,{backgroundColor:'#379237'}]}
                                    onPress={() => {
                                        startSendLocation(0),
                                        sendStatus('arrived')
                                    }}
                                >
                                    <MaterialCommunityIcons name="map-marker-check" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center'}}
                        >
                            <View
                                style={{
                                    width:viewWidth,
                                    maxHeight:70,
                                    flex: 1,
                                    flexDirection:'row-reverse',
                                    justifyContent:'space-between',
                                    backgroundColor: 'white',
                                }}
                            >
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>
                                        الذهاب
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.button,{backgroundColor:"#5BC0F8"}]}
                                    onPress={() => {
                                        startSendLocation(1),
                                        sendStatus('started')
                                    }}
                                >
                                    <Foundation name="map" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SwiperFlatList>
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
        padding: 10,
        width:'25%',
        height:70
    },
    button2: {
        justifyContent: "center",
        alignItems: "center",
        width:50,
        height:50,
        borderRadius:25,
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
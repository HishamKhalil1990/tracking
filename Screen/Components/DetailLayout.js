import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Platform, TextInput, ScrollView, Dimensions, AppState,Alert } from "react-native"
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
import * as TaskManager from 'expo-task-manager';
import { Feather } from '@expo/vector-icons'; 

const widowWidth = Dimensions.get('window').width;
const viewWidth = 0.8*widowWidth;

const LOCATION_TRACKING = 'background-location-task';
let isStarted = false
let stage = ''
let token;
let tripName='';
let orderNo = ''

TaskManager.defineTask(LOCATION_TRACKING, ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    const long = locations[0].coords.longitude;
    const lat = locations[0].coords.latitude
    api.sendLocation(token,{long,lat},tripName,orderNo)
    .then(() => {})
    .catch(() => {});
});

export default DetailLayout = ({ route, navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [mapInd, setMapInd] = useState(0);
    const [url, setUrl] = useState()
    const [allowPhone, setAllowPhone] = useState(false)

    const swipeRef = useRef()
    const mapSwipeRef = useRef()
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ){
            console.log('App has come to the foreground!');
            toggleLocationTask(false)
          }else{
            appState.current = nextAppState;
            console.log('AppState', appState.current);
          }
        });
    
        return () => {
          subscription.remove();
        };
    }, []);

    const toggleLocationTask = async (status) => {
        isStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TRACKING
        );
        if (status & isStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TRACKING)
        } else if (!status & !isStarted) {
            await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
                accuracy: Location.Accuracy.Balanced,
                timeInterval: route.params.data.timeInterval? route.params.data.timeInterval : 5000,
                distanceInterval: 0,
            });
        }
    };

    const openAddressOnMap = async() => {
        let location = await Location.getCurrentPositionAsync({});
        const url = `https://www.google.com/maps/dir/?api=1&origin=${location.coords.latitude},${location.coords.longitude}&destination=${route.params.data.destination.lat},${route.params.data.destination.long}&travelmode=car`
        Linking.openURL(url);
      };

    useEffect(() => {
        orderNo = route.params.data.no
        if(route.params.data.status == 'arrived'){
            stage = route.params.data.status
            tripName = route.params.data.tripName
            setAllowPhone(true)
        }
        const checkStorage = async () => {
          let user = await AsyncStorage.getItem("user");
          user = JSON.parse(user);
          token = user.token;
        };
        checkStorage();
        (async () => {
            let location = await Location.getCurrentPositionAsync({});
            setUrl(`https://www.google.es/maps/dir/'${location.coords.latitude},${location.coords.longitude}'/'${route.params.data.destination.lat},${route.params.data.destination.long}'`)
        })();
        return () => {
            isStarted = false
            stage = ''
            token;
            tripName='';
            orderNo = ''
            toggleLocationTask(true)
            const start = async() => {
                let location = await Location.getCurrentPositionAsync({});
                const data = {
                    long:location.coords.longitude,
                    lat:location.coords.latitude
                }
                if(stage == 'started'){
                    api.send(token,'canceled',tripName,orderNo,data)
                    .then(() => {})
                    .catch(() => {})
                }else if(stage == 'arrived'){
                    route.params.editOrderData(stage,tripName,route.params.index)
                }
            }
            start()
        }
    }, []);

    const startSendLocation = (index,toIndex) => {
        swipeRef.current.scrollToIndex({index:toIndex})
        if(index == 0){
            toggleLocationTask(false)
        }else if(index == 1){
            toggleLocationTask(true)
        }
    }

    const action = (index,skip) => {
        switch(index){
            case 0:
                if(stage == ''){
                    sendStatus('started')
                    .then(() => {
                        startSendLocation(index,1)
                        if(!skip){
                            openAddressOnMap()
                        }
                        stage = 'started'
                    }).catch(() => {})
                }else if(stage == 'started'){
                    swipeRef.current.scrollToIndex({index:1})
                    if(!skip){
                        openAddressOnMap()
                    }
                }else if(stage == 'arrived'){
                    swipeRef.current.scrollToIndex({index:2})
                    alert('الرحلة تم القيام بها وحفظ الوصول مسبقا')
                }
                break;
            case 1:
                if(stage == ''){
                    swipeRef.current.scrollToIndex({index:0})
                    alert('الرجاء بدء الذهاب اولا')
                }else if(stage == 'started'){
                    sendStatus('arrived')
                    .then(() => {
                        startSendLocation(index,1)
                        stage = 'arrived'
                        setAllowPhone(true)
                    }).catch(() => {})
                }else if(stage == 'arrived'){
                    swipeRef.current.scrollToIndex({index:2})
                    alert('تم حفظ الوصول سابقا')
                }
                break;
            case 2:
                if(stage == ''){
                    swipeRef.current.scrollToIndex({index:0})
                    alert('الرجاء بدء الذهاب اولا')
                }else if(stage == 'started'){
                    swipeRef.current.scrollToIndex({index:1})
                    alert('الرجاء حفظ الوصول اولا')
                }else if(stage == 'arrived'){
                    sendStatus('finished')
                    .then(() => {
                        stage = 'finished'
                    }).catch(() => {})
                }
                break;
            default:
                break;
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
        return new Promise((resolve,reject) => {
            const start = async () => {
                setIsLoading(true);
                let location = await Location.getCurrentPositionAsync({});
                const data = {
                    long:location.coords.longitude,
                    lat:location.coords.latitude
                }
                api
                .send(token,status,tripName,orderNo,data)
                .then((results) => {
                    setIsLoading(false);
                    if (results.status == "success") {
                        if(results.msg){
                            alert(results.msg)
                        }
                        if(status == 'started'){
                            tripName = results.tripName
                        }else if(status == 'finished'){
                            route.params.setOrderNo(route.params.index)
                            navigation.goBack()
                        }
                        resolve()
                    } else if (results.status == "unauthorized"){
                        AsyncStorage.clear()
                        alert(
                            "انتهت الجلسة الرجاء اعادة الدخول مرة اخرى"
                        );
                        navigation.replace('Auth')
                        reject()
                    } else if (results.status == "failed"){
                        alert(results.msg)
                        reject()
                    }
                })
                .catch((num) => {
                    setIsLoading(false);
                    if (num == 1) {
                        alert("حدث خطا ما الرجاء المحاولة مرة اخرى");
                    } else {
                        alert("الرجاء التاكد من الاتصال بالانترنت");
                    }
                    reject()
                });
            }
            start()
        })
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
                            style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center',borderTopColor:'#EEEEEE',borderTopWidth:1}}
                        >
                            <View
                                style={{
                                    height:'100%',
                                    width:widowWidth,
                                    backgroundColor:'#fff',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,

                                    elevation: 5,
                                    //borderRadius:10
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
                                        if(stage == ''){
                                            toggleLocationTask(false)
                                            Linking.openURL(event.url)
                                        }else if(stage == 'started'){
                                            Linking.openURL(event.url)
                                        }
                                        action(0,true)
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
                    style={{width:widowWidth,flex:1,justifyContent:'center',alignItems:'center',maxHeight:70,marginTop:-30}}  
                    >
                    <View
                        style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#EEEEEE',borderRadius:60,width:70}} 
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
                </View>
                <View
                    style={{width:'100%', marginTop:-10,zIndex:0}}
                >   
                    <SwiperFlatList
                        style={{height:140}}
                        showPagination={true}
                        paginationActiveColor={theme.colors.general}
                        index={route.params.data.status == 'arrived'? 2 : 0}
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
                                        الذهاب
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.button,{backgroundColor:"#5BC0F8"}]}
                                    onPress={() => {
                                        if(stage == ''){
                                            Alert.alert(
                                                'بدء الرحلة',
                                                'هل تريد الاستمرار ببدء الرحلة ؟',
                                                [
                                                  {
                                                    text: 'الغاء',
                                                    onPress: () => {
                                                      return null;
                                                    },
                                                  },
                                                  {
                                                    text: 'استمرار',
                                                    onPress: () => {
                                                        action(0,false)
                                                    },
                                                  },
                                                ],
                                                {cancelable: false},
                                            );
                                        }else{
                                            action(0,false)
                                        }
                                    }}
                                >
                                    <Foundation name="map" size={30} color="#fff" />
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
                                {!allowPhone?
                                    <>
                                        <View style={styles.viewText}>
                                            <Text style={styles.text}>
                                                وصلت
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.button,{backgroundColor:'#379237'}]}
                                            onPress={() => {
                                                if(stage == 'started'){
                                                    Alert.alert(
                                                        'حفظ الوصول',
                                                        'هل تريد الاستمرار بحفظ الوصول ؟',
                                                        [
                                                        {
                                                            text: 'الغاء',
                                                            onPress: () => {
                                                            return null;
                                                            },
                                                        },
                                                        {
                                                            text: 'استمرار',
                                                            onPress: () => {
                                                                action(1,false)
                                                            },
                                                        },
                                                        ],
                                                        {cancelable: false},
                                                    );
                                                }else{
                                                    action(1,false)
                                                }
                                            }}
                                        >
                                            <MaterialCommunityIcons name="map-marker-check" size={30} color="#fff" />
                                        </TouchableOpacity>
                                    </>
                                :
                                        <>
                                            <TouchableOpacity
                                                style={[styles.button,{borderLeftColor:"#5BC0F8",borderLeftWidth:2}]}
                                                onPress={() => {
                                                    swipeRef.current.scrollToIndex({index:2})
                                                }}
                                            >
                                                <Feather name="x" size={24} color="#5BC0F8" />
                                            </TouchableOpacity>
                                            <View style={styles.viewText2}>
                                                <Text style={styles.text}>
                                                    اتصال
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.button,{backgroundColor:'#379237'}]}
                                                onPress={() => {
                                                    swipeRef.current.scrollToIndex({index:2})
                                                    const url = `tel://${route.params.data.phone}`
                                                    Linking.openURL(url)
                                                }}
                                            >
                                                <Feather name="phone-call" size={24} color="#fff" />
                                            </TouchableOpacity>
                                        </>
                                }
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
                                        انتهيت
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.button,,{backgroundColor:'#FF6D28'}]}
                                    onPress={() => {
                                        if(stage == 'aarived'){
                                            Alert.alert(
                                                'حفظ الانتهاء',
                                                'هل تريد الاستمرار بحفظ الانتهاء ؟',
                                                [
                                                  {
                                                    text: 'الغاء',
                                                    onPress: () => {
                                                      return null;
                                                    },
                                                  },
                                                  {
                                                    text: 'استمرار',
                                                    onPress: () => {
                                                        action(2,false)
                                                    },
                                                  },
                                                ],
                                                {cancelable: false},
                                            );
                                        }else{
                                            action(2,false)
                                        }
                                    }}
                                >
                                    <MaterialIcons name="done-all" size={30} color="#fff" />
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
    viewText2:{
        width:'50%',
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
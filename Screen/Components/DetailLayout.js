import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking, Platform, TextInput, ScrollView } from "react-native"
import api from "../../api/api";
import Loader from "./Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from "../../utils/theme"

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
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
          });
          const latLng = `${route.params.data.destination.lat},${route.params.data.destination.long}`;
          const label = label;
          const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
          });
        openExternalApp(url);
    };
    
    const openExternalApp = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
            Linking.openURL(url);
            } else {
            Alert.alert(
                'ERROR',
                'Unable to open: ' + url,
                [
                {text: 'OK'},
                ]
            );
            }
        });
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
                <TextInput 
                    value={route.params.data.description}
                    editable={false}
                    multiline={true}
                    numberOfLines={20}
                    style={{
                        marginTop:25,
                        height:'40%',
                        width:'80%',
                        backgroundColor:'#fff',
                        textAlign:'right',
                        textAlignVertical:'top',
                        color:'black',
                        fontSize:17,
                        fontWeight:'bold',
                        padding:10,
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
                />
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
                        style={styles.button}
                        onPress={openAddressOnMap}
                    >
                        <Text>
                            click
                        </Text>
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
                        style={styles.button}
                        onPress={() => {sendStatus('arrived')}}
                    >
                        <Text>
                            click
                        </Text>
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
                        style={styles.button}
                        onPress={() => {sendStatus('finished')}}
                    >
                        <Text>
                            click
                        </Text>
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
        backgroundColor: "#5BC0F8",
        padding: 10,
        width:'25%',
        height:70
    },
    btuText:{
        fontWeight: 'bold',
        fontSize:20,
        color:'#fff'
    }
})
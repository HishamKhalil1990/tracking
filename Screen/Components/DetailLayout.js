import { Text, View, StyleSheet, TouchableOpacity, Linking, Platform, TextInput, ScrollView } from "react-native"
import theme from "../../utils/theme"

export default DetailLayout = ({ route, navigation }) => {

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
                        onPress={() => {}}
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
                        onPress={() => {}}
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
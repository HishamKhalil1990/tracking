import { Text, View, StyleSheet, TouchableOpacity, Linking, Platform, } from "react-native"
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
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:'#EEEEEE'
            }}
            >
            <TouchableOpacity
                style={styles.button}
                onPress={openAddressOnMap}
            >
                <Text>
                    click
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{
        paddingLeft:20,
        marginTop:5,
        marginBottom:5,
        color:'#fff'
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
})
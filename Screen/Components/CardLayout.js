import { Text, View, StyleSheet } from "react-native"
import theme from "../../utils/theme"

export default CardLayout = ({ record }) => {
    
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop:30,
            }}>
            <View
                style={{
                    width:'85%',
                    paddingBottom:15,
                    backgroundColor: theme.colors.general,
                    borderRadius:25,
                    flex:1,
                    justifyContent:'center'
                }}
            >
                <Text style={styles.text}>
                    name: {record.name}
                </Text>
                <Text style={styles.text}>
                    description: {record.description}
                </Text>
                <Text style={styles.text}>
                    long: {record.destination.long}
                </Text>
                <Text style={styles.text}>
                    lat: {record.destination.lat}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{
        paddingLeft:20,
        marginTop:5,
        marginBottom:5,
        color:'#fff'
    }
})
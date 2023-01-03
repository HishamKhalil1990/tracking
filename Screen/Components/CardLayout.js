import { Text, View, StyleSheet } from "react-native"
import theme from "../../utils/theme"

export default CardLayout = ({ record }) => {
    
    return (
        <View
            style={{
                width:'95%',
                paddingTop:15,
                paddingBottom:15,
                backgroundColor: theme.colors.general,
                marginBottom:25,
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
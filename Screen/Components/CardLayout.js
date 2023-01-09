import { useState } from "react"
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { color } from "react-native-reanimated"
import theme from "../../utils/theme"

export default CardLayout = ({ record, index, navigation, setOrderNo }) => {

    const [data,setData] = useState(record)
    
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
                    marginBottom:5,
                    flex: 1,
                    flexDirection:'row-reverse',
                    alignItems: "center",
                    justifyContent:'space-between',
                    backgroundColor: 'white',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}
            >
                <View style={styles.viewText}>
                    <Text style={styles.text}>
                        {record.name}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {navigation.navigate('detail',{data,index,setOrderNo})}}
                >
                    <Text style={styles.btuText}>
                        عرض
                    </Text>   
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewText:{
        width:'75%',
        height:70,
        flex: 1,
        flexDirection:'row-reverse',
        alignItems: "center",
        justifyContent:'space-between',
    },
    text:{
        fontWeight: 'bold',
        fontSize:15,
        marginTop:5,
        marginBottom:5,
        marginRight:10,
        textAlign:'right',
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
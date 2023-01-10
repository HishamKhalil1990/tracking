import { useState } from "react"
import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import theme from "../../utils/theme"
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default CardLayout = ({ record, index, navigation, setOrderNo }) => {

    const [data,setData] = useState(record)
    
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop:index==0? 30 : 0,
            }}>
            <View
                style={{
                    width:'85%',
                    marginBottom:2,
                    flex: 1,
                    flexDirection:'row-reverse',
                    alignItems: "center",
                    justifyContent:'space-between',
                    backgroundColor: 'white',
                    borderRadius:10,
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
                        <MaterialCommunityIcons name="page-next-outline" size={40} color="#fff" />
                    </Text>   
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewText:{
        width:'70%',
        height:120,
        flex: 1,
        flexDirection:'row-reverse',
        alignItems: "center",
        justifyContent:'space-between',
    },
    text:{
        // fontWeight: 'bold',
        fontSize:25,
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
        width:'30%',
        height:120,
        borderBottomLeftRadius:10,
        borderTopLeftRadius:10
    },
    btuText:{
        fontWeight: 'bold',
        fontSize:25,
        color:'#fff'
    }
})
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
                    width:'97%',
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
                    <Text style={[styles.text,{marginTop:10}]}>
                        {record.name}
                    </Text>
                    <Text style={[styles.text,{marginTop:5}]}>
                        رقم الطلبية: {record.no}
                    </Text>
                    <Text style={[styles.text,{marginTop:5}]}>
                        الحي: {record.region}
                    </Text>
                    <View style={{marginTop:-5,width:'100%',flex: 1,flexDirection:'row-reverse',alignItems: "center",justifyContent:'space-between',}}>
                        <Text style={[styles.text]}>
                            الكمية: {record.qty}
                        </Text>
                        <Text style={[styles.text2]}>
                            المبلغ: {record.price} JD
                        </Text>
                    </View>
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
        alignItems: "flex-end",
        justifyContent:'flex-start',
    },
    text:{
        // fontWeight: 'bold',
        fontSize:15,
        // marginBottom:5,
        marginRight:10,
        textAlign:'right',
    },
    text2:{
        fontWeight: 'bold',
        fontSize:17,
        // marginBottom:5,
        marginLeft:10,
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
import { useState } from "react"
import { TouchableOpacity,StyleSheet,Text,View,Alert } from "react-native"
import SwipeableFlatList from 'react-native-swipeable-list'
import CardLayout from "./CardLayout"
import { Dimensions, RefreshControl } from "react-native"
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

export default CardList = ({ data, token, setIsLoading, getUserOrders, navigation, setOrderNo, editOrderData }) => {
    const [allData,setAllData] = useState(data)
    const [refreshing, setRefreshing] = useState(false)
    const refresh = () => {
        setIsLoading(true)
        getUserOrders(token)
    }

    const extractItemKey = (item) => {
        return `${item.id}`;
    };

    const deleteItem = (itemId) => {
        let newData = [...allData];
        newData = newData.filter(item => item.id !== itemId);
        setAllData(newData);
      };

    const call = async(item) => {
        alert('called')
    }

    const QuickActions = (index, item) => {
        return (
          <View style={[styles.qaContainer,{paddingTop:index==0? 30 : 0}]}>
            <TouchableOpacity 
                style={[styles.button2]} 
                onPress={() => {
                    Alert.alert(
                        'حذف الطلب',
                        'هل تريد الاستمرار بحذف الطلب ؟',
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
                                deleteItem(item.id)
                            },
                          },
                        ],
                        {cancelable: false},
                    );
                }}
            >
                <AntDesign name="delete" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={() => call(item)}>
                <Feather name="phone-call" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        );
      };

    return (
        <SwipeableFlatList
            style={{
                width:windowWidth,
                backgroundColor:'#EEEEEE'
            }}
            keyExtractor={extractItemKey}
            data={allData}
            renderItem={({item,index}) => (
              <CardLayout record={item} index={index} navigation={navigation} setOrderNo={setOrderNo} editOrderData={editOrderData}/>
            )}
            maxSwipeDistance={240}
            renderQuickActions={({index, item}) => QuickActions(index, item)}
            shouldBounceOnMount={true}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            }
        />
    )
}

const styles = StyleSheet.create({
    qaContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom:5,
        width:'97%',
        backgroundColor:'#fff',
        borderBottomRightRadius:10,
        borderTopRightRadius:10
    },
    button: {
        height:'100%',
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'green',
        borderBottomRightRadius:10,
        borderTopRightRadius:10
    },
    button2: {
        height:'100%',
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'red',
    },
})
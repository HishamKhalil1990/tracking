import { FlatList,TouchableOpacity,StyleSheet,Text,View } from "react-native"
import SwipeableFlatList from 'react-native-swipeable-list'
import CardLayout from "./CardLayout"
import { Dimensions, RefreshControl } from "react-native"
import { useState } from "react";

const windowWidth = Dimensions.get('window').width;

export default CardList = ({ data, token, setIsLoading, getUserOrders, navigation, setOrderNo }) => {
    const [refreshing, setRefreshing] = useState(false)
    const refresh = () => {
        setIsLoading(true)
        getUserOrders(token)
    }

    const extractItemKey = (item) => {
        return `${item.id}`;
    };

    const renderItem = (item,index) => {
        return(
            <CardLayout record={item} index={index} navigation={navigation} setOrderNo={setOrderNo}/>
        )
    }

    const call = async(item) => {
        alert('called')
    }

    const QuickActions = (index, item) => {
        return (
          <View style={[styles.qaContainer,{paddingTop:index==0? 30 : 0}]}>
            <TouchableOpacity style={[styles.button]} onPress={() => call(item)}>
                {/* <Feather name="edit" size={30} color="#fff" /> */}
                <Text>
                    Call
                </Text>
            </TouchableOpacity>
          </View>
        );
      };

    return (
        // <FlatList 
        //     style={{
        //         width:windowWidth,
        //         backgroundColor:'#EEEEEE'
        //     }}
        //     data={data}
        //     renderItem={({item, index}) => renderItem(item,index)}
        //     keyExtractor={item => item.no}
        //     refreshControl={
        //         <RefreshControl
        //             refreshing={refreshing}
        //             onRefresh={refresh}
        //         />
        //     }
        // />
        <SwipeableFlatList
            style={{
                width:windowWidth,
                backgroundColor:'#EEEEEE'
            }}
            keyExtractor={extractItemKey}
            data={data}
            renderItem={({item,index}) => (
              <CardLayout record={item} index={index} navigation={navigation} setOrderNo={setOrderNo}/>
            )}
            maxSwipeDistance={120}
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
})
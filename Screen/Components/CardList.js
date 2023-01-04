import { FlatList } from "react-native"
import CardLayout from "./CardLayout"
import { Dimensions, RefreshControl } from "react-native"
import { useState } from "react";

const windowWidth = Dimensions.get('window').width;

export default CardList = ({ data, token, setIsLoading, getUserOrders, navigation }) => {
    const [refreshing, setRefreshing] = useState(false)
    const refresh = () => {
        setIsLoading(true)
        getUserOrders(token)
    }

    const renderItem = (item,index) => {
        return(
            <CardLayout record={item} index={index} navigation={navigation}/>
        )
    }

    return (
        <FlatList 
            style={{
                width:windowWidth,
                backgroundColor:'#EEEEEE'
            }}
            data={data}
            renderItem={({item, index}) => renderItem(item,index)}
            keyExtractor={item => item.name}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            }
        />
    )
}
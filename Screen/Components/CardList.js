import { FlatList } from "react-native"
import CardLayout from "./CardLayout"
import { Dimensions, RefreshControl } from "react-native"
import { useState } from "react";

const windowWidth = Dimensions.get('window').width;

export default CardList = ({ data, cardCode, setIsLoading, getUserOrders }) => {
    const [refreshing, setRefreshing] = useState(false)
    const refresh = () => {
        setIsLoading(true)
        getUserOrders(cardCode)
    }

    const renderItem = ({item}) => {
        return(
            <CardLayout record={item} />
        )
    }

    return (
        <FlatList 
            style={{
                width:0.9*windowWidth,
            }}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.APPNO}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                />
            }
        />
    )
}
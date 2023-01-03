import { FlatList } from "react-native"
import CardLayout from "./CardLayout"
import { Dimensions, RefreshControl } from "react-native"
import { useState } from "react";

const windowWidth = Dimensions.get('window').width;

export default CardList = ({ data, token, setIsLoading, getUserOrders }) => {
    const [refreshing, setRefreshing] = useState(false)
    const refresh = () => {
        setIsLoading(true)
        getUserOrders(token)
    }

    const renderItem = ({item}) => {
        return(
            <CardLayout record={item} />
        )
    }

    return (
        <FlatList 
            style={{
                width:windowWidth,
            }}
            data={data}
            renderItem={renderItem}
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
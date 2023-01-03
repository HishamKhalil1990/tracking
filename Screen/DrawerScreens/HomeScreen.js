// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import 'react-native-gesture-handler';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createStackNavigator} from '@react-navigation/stack';
import api from "../../api/api";
import CardList from "../Components/CardList";
import Loader from "../Components/Loader";

const Stack = createStackNavigator()

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserOrders = async (token) => {
    api
      .getOrders(token)
      .then((results) => {
        setIsLoading(false);
        if (results.status == "success") {
          if (results.data.length > 0) {
            alert("تم التحديث");
          } else {
            alert("لا يوجد طلبيات");
          }
          setData(results.data);
        } else if (results.status == "unauthorized"){
          AsyncStorage.clear()
          alert(
            "انتهت الجلسة الرجاء اعادة الدخول مرة اخرى"
          );
          navigation.replace('Auth')
        }
      })
      .catch((num) => {
        setIsLoading(false);
        if (num == 1) {
          alert("حدث خطا ما الرجاء المحاولة مرة اخرى");
        } else {
          alert("الرجاء التاكد من الاتصال بالانترنت");
        }
      });
  };

  useEffect(() => {
    const checkStorage = async () => {
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      setToken(user.token);
    };
    checkStorage();
  }, []);

  useEffect(() => {
    if (token != "") {
      getUserOrders(token);
    }
  }, [token]);

  const Cards = () => {
    return (
      <CardList
        data={data}
        token={token}
        setIsLoading={setIsLoading}
        getUserOrders={getUserOrders}
      />
    );
  };

  const Detail = () => {
    return(
      <View>
        <Text>
          detail
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      {isLoading?
        <View style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View><Loader loading={isLoading} /></View>
          </View>
        </View>
      :
        <Stack.Navigator initialRouteName="cards" screenOptions={{
          cardStyle:{flex:1,alignItems: "center",justifyContent: "center",}
        }}>
          <Stack.Screen
            name="cards"
            component={Cards}
            options={{headerShown: false,}}
          />
          <Stack.Screen
            name="detail"
            component={Detail}
          />
      </Stack.Navigator>
      }
    </SafeAreaView>
  );
};

export default HomeScreen;

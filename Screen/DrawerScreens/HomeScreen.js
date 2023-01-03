// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import CardList from "../Components/CardList";
import Loader from "../Components/Loader";

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

  const showData = () => {
    return (
      <CardList
        data={data}
        token={token}
        setIsLoading={setIsLoading}
        getUserOrders={getUserOrders}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>{isLoading ? <Loader loading={isLoading} /> : showData()}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

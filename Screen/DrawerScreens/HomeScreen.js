// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import CardList from "../Components/CardList";
import Loader from "../Components/Loader";

const HomeScreen = () => {
  const [cardCode, setCardCode] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserOrders = async (cardcode) => {
    api
      .getOrders(cardcode)
      .then((results) => {
        setIsLoading(false);
        if (results.status == "success") {
          if (results.orders.length > 0) {
            alert("updated");
          } else {
            alert("no open orders");
          }
          setData(results.orders);
        } else {
          alert(
            "could not update due to server shutdown, please try again later"
          );
        }
      })
      .catch((num) => {
        setIsLoading(false);
        if (num == 1) {
          alert("somthing wrong happened ! please try again");
        } else {
          alert("Please check internet");
        }
      });
  };

  useEffect(() => {
    const checkStorage = async () => {
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      setCardCode(user.cardcode);
    };
    checkStorage();
  }, []);

  useEffect(() => {
    if (cardCode != "") {
      getUserOrders(cardCode);
    }
  }, [cardCode]);

  const showData = () => {
    return (
      <CardList
        data={data}
        cardCode={cardCode}
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

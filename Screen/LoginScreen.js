import { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "./Components/Loader";
import api from "../api/api";
import theme from "../utils/theme";

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userOdometer, setUserOdometer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");

  const passwordInputRef = createRef();
  const userOdometerRef = createRef();

  useEffect(() => {
    const checkStorage = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        navigation.replace("DrawerNavigationRoutes");
      }
    };
    checkStorage();
  }, []);

  const handleSubmitPress = () => {
    setErrortext("");
    if (!userName) {
      alert("Please fill Username");
      return
    }
    if (!userPassword) {
      alert("Please fill Password");
      return
    }
    if (!userOdometer) {
      alert("Please fill Odometer");
      return
    }
    if(userName && userPassword && userOdometer){
      setLoading(true);
      api
        .checkUser(userName, userPassword, userOdometer)
        .then((response) => {
          //Hide Loader
          setLoading(false);
          // If server response message same as Data Matched
          if (response.status === "success") {
            AsyncStorage.setItem(
              "user",
              JSON.stringify({
                token:response.auth.token,
                username:userName
              })
            );
            navigation.replace("DrawerNavigationRoutes");
          } else {
            setErrortext(response.msg);
          }
        })
        .catch((num) => {
          //Hide Loader
          setLoading(false);
          if (num == 1) {
            setErrortext("حدث خطا ما الرجاء المحاولة مرة اخرى");
          } else {
            setErrortext("الرجاء التاكد من الاتصال بالانترنت");
          }
        });
    }
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../assets/abuodeh.png")}
                style={{
                  width: "50%",
                  height: 100,
                  resizeMode: "contain",
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserName) => setUserName(UserName)}
                placeholder="Enter Username"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                placeholder="Enter Password"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                returnKeyType="next"
                secureTextEntry={true}
                ref={passwordInputRef}
                onSubmitEditing={() =>
                  userOdometerRef.current && userOdometerRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserOdometer) => setUserOdometer(UserOdometer)}
                placeholder="Enter Odometer"
                placeholderTextColor="#8b9cb5"
                keyboardType="number-pad"
                ref={userOdometerRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != "" ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: theme.colors.general,
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: theme.colors.general,
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: theme.colors.general,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: theme.colors.general,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});

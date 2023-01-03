import { useState } from "react";
import { ScrollView } from "react-native";

import {
    SettingsDividerShort,
    SettingsDividerLong,
    SettingsEditText,
    SettingsCategoryHeader,
    SettingsSwitch,
    SettingsPicker
  } from "react-native-settings-components";
  
  export default SettingLayout = (props) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // const [gender, setGender] = useState("")
    // const [allowPushNotifications, setAllowPushNotifications] = useState("")
    // constructor() {
    //   super();
    //   this.state = {
    //     username: "",
    //     allowPushNotifications: false,
    //     gender: ""
    //   };
    // }
  
    return (
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <SettingsCategoryHeader
          title={"My Account"}
          textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
        />
        <SettingsDividerLong android={Platform.OS === "android"} />
        <SettingsEditText
          positiveButtonTitle={'h'}
          title="Username"
          dialogDescription={"Enter your username."}
          valuePlaceholder="..."
          negativeButtonTitle={"Cancel"}
          buttonRightTitle={"Save"}
          onValueChange={value => {
            setUsername(value)
          }}
          value={username}        
        />
        <SettingsDividerLong android={Platform.OS === "android"} />
        <SettingsEditText
          positiveButtonTitle={'h'}
          title="password"
          dialogDescription={"Enter your password."}
          valuePlaceholder="..."
          negativeButtonTitle={"Cancel"}
          buttonRightTitle={"Save"}
          onValueChange={value => {
            setPassword(value)
          }}
          value={password}        
        />
        <SettingsDividerLong android={Platform.OS === "android"} />
        {/* <SettingsDividerShort />
        <SettingsPicker
          title="Gender"
          dialogDescription={"Choose your gender."}
          options={[
            { label: "...", value: "" },
            { label: "male", value: "male" },
            { label: "female", value: "female" },
            { label: "other", value: "other" }
          ]}
          onValueChange={value => {
            console.log("gender:", value);
            setGender(value)
          }}
          value={gender}
          styleModalButtonsText={{ color: colors.monza }}
        />
        <SettingsSwitch
          title={"Allow Push Notifications"}
          onValueChange={value => {
            console.log("allow push notifications:", value);
            setAllowPushNotifications(value)
          }}
          value={allowPushNotifications}
          trackColor={{
            true: colors.switchEnabled,
            false: colors.switchDisabled,
          }}
        /> */}
      </ScrollView>
    )
  }
  
  const colors = {
    white: "#FFFFFF",
    monza: "#C70039",
    switchEnabled: "#C70039",
    switchDisabled: "#efeff3",
    blueGem: "#27139A",
  };
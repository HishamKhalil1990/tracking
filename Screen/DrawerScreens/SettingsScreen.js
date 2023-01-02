// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
 
// Import React and Component
import {View, Text, SafeAreaView} from 'react-native';
import SettingLayout from '../Components/SettingLayout';
 
const SettingsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingTop: 16}}>
        <View
          style={{
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
          }}>
          <View style={{
            flex:1,
          }}>
            <SettingLayout />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
 
export default SettingsScreen;

import 'react-native-gesture-handler';
import { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
 
// Import Screens
import LoginScreen from './Screen/LoginScreen';
import DrawerNavigationRoutes from './Screen/DrawerNavigationRoutes';
import * as Location from 'expo-location';
 
const Stack = createStackNavigator();
 
const Auth = () => {

  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
 
const App = () => {

  useEffect(() => {
    (async () => {
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const { status } = await Location.requestBackgroundPermissionsAsync()
        if (status !== 'granted') {
          alert('Permission to access location was denied');
        }
      }else{
        alert('Permission to access location was denied');
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
export default App;

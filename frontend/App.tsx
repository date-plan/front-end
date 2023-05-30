import React from 'react';
import { RecoilRoot } from 'recoil';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterPhoneNum from './src/screens/RegisterPhoneNum';
import RegisterUserInfo from './src/screens/RegisterUserInfo';
import Login from './src/screens/Login';
import { RouteScreens, StackParamList } from './src/types/navigationType';

const Stack = createStackNavigator<StackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

function App() {
  return (
    <RecoilRoot>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name={RouteScreens.RegisterPhoneScreen}
            component={RegisterPhoneNum}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={RouteScreens.RegisterInfoScreen}
            component={RegisterUserInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={RouteScreens.LoginScreen}
            component={Login}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;

import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import Weather from './src/screens/Weather';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import CreditsScreen from './src/screens/CreditsScreen';
const Stack = createStackNavigator();
const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Weather"
            component={Weather}
            options={{headerTransparent: true, headerTitle: ''}}
          />
          <Stack.Screen
            name="Credits"
            component={CreditsScreen}
            options={{headerTransparent: true,headerTintColor:useColorScheme() === 'dark'? '#fff':'#333',headerBackTitle:'Weather',headerTitleAlign:'center'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

import React from 'react';
import {SafeAreaView} from 'react-native';
import Weather from './src/components/Weather';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Weather />
    </SafeAreaView>
  );
};

export default App;

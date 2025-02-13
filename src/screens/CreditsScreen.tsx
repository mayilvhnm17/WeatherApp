import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useColorScheme} from 'react-native';

const CreditsScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkBackground : styles.lightBackground,
      ]}>
      <Text
        style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        Weather App
      </Text>
      <Text
        style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
        Version: 1.0.0
      </Text>
      <Text
        style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
        Developed by: <Text style={styles.highlight}>Mayilvahanam.P</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  lightBackground: {
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
});

export default CreditsScreen;

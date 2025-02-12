import React, {useEffect, useState} from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {
  getWeatherByCity,
  getCityFromCoords,
  WeatherData,
} from '../api/weatherService';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

// Country & City Data
const countryCityMap: { [key: string]: string[] } = {
  USA: ["New York", "Los Angeles", "Chicago"],
  India: ["Delhi", "Mumbai", "Bangalore"],
  UK: ["London", "Manchester", "Birmingham"],
};

// Weather condition-based gradient colors
const weatherGradients: { [key: string]: string[] } = {
  Clear: ["#ff7e5f", "#feb47b"], // Sunny
  Clouds: ["#667db6", "#0082c8"], // Cloudy
  Rain: ["#373B44", "#4286f4"], // Rainy
  Drizzle: ["#3a7bd5", "#3a6073"], // Light Rain
  Thunderstorm: ["#141e30", "#243b55"], // Stormy
  Snow: ["#bdc3c7", "#ffffff"], // Snowy
  Mist: ["#4b6cb7", "#182848"], // Misty
  Fog: ["#636e72", "#b2bec3"], // Foggy
  Haze: ["#3e5151", "#decba4"], // Hazy
  Default: ["#2193b0", "#6dd5ed"], // Default
};


const Weather = () => {
      const [selectedCountry, setSelectedCountry] = useState<string>('USA');
      const [selectedCity, setSelectedCity] = useState<string>('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
 const [gradient, setGradient] = useState<string[]>(
   weatherGradients['Default'],
 );

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Request location permissions
  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await request(permission);

    if (result !== RESULTS.GRANTED) {
      Alert.alert(
        'Permission Denied',
        'We need location access to get weather info.',
      );
    }
  };

    useEffect(() => {
      fetchWeather(selectedCity);
    }, [selectedCity]);

  // Get weather using live location
  const getCurrentLocationWeather = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        try {
          const city = await getCityFromCoords(latitude, longitude);
          if (city) {
            fetchWeather(city);
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          setLoading(false);
        }
      },
      error => {
        console.error('Geolocation error:', error);
        Alert.alert('Error', 'Could not fetch location. Please try again.');
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Fetch weather from API
  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      updateGradient(data.weather[0].main);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateGradient = (condition: string) => {
    setGradient(weatherGradients[condition] || weatherGradients['Default']);
  };

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.label}>Select Country</Text>
      <Picker
        selectedValue={selectedCountry}
        style={styles.picker}
        onValueChange={itemValue => {
          setSelectedCountry(itemValue);
          setSelectedCity(countryCityMap[itemValue][0]);
        }}>
        {Object.keys(countryCityMap).map(country => (
          <Picker.Item key={country} label={country} value={country} />
        ))}
      </Picker>

      {/* City Selector */}
      <Text style={styles.label}>Select City</Text>
      <Picker
        selectedValue={selectedCity}
        style={styles.picker}
        onValueChange={itemValue => setSelectedCity(itemValue)}>
        {countryCityMap[selectedCountry].map(city => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>

      {/* Get Current Location Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={getCurrentLocationWeather}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>

      {/* Display Weather */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      ) : weather ? (
        <>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temperature}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`,
            }}
            style={styles.icon}
          />
        </>
      ) : (
        <Text style={styles.error}>Could not fetch weather data.</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  city: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 18,
    color: 'white',
    textTransform: 'capitalize',
  },
  icon: {
    width: 100,
    height: 100,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    color: "white",
    marginTop: 10,
  },
  picker: {
    width: 200,
    height: 50,
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    marginBottom: 10,
  }
});

export default Weather;

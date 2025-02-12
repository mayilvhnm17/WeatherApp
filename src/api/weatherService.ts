import axios from 'axios';

const API_KEY = '91b9aca4ffb672710a97764ede6c2630'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  name: string;
  main: {temp: number};
  weather: {main: string; description: string; icon: string}[];
}
// Fetch weather by city name
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {q: city, units: 'metric', appid: API_KEY},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Fetch city name from coordinates (Reverse Geocoding)
export const getCityFromCoords = async (
  lat: number,
  lon: number,
): Promise<string | null> => {
  try {
    console.log('lat:', lat, 'lon:', lon);
    const response = await axios.get(`${BASE_URL}`, {
      params: {lat, lon, appid: API_KEY},
    });
    return response.data.name; // Extract city name
  } catch (error) {
    console.error('Error getting city from coordinates:', error);
    return null;
  }
};

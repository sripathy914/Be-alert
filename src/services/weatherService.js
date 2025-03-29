const API_KEY = '154563bad3002edd770740b01695beeb';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (cityName, lat, lon) => {
  let url;
  
  if (lat && lon) {
    url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else if (cityName) {
    url = `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  } else {
    throw new Error('Either city name or coordinates must be provided');
  }

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch weather data');
  }

  return data;
}; 
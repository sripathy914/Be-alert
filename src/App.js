import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faWind, faTint, faCompressArrowsAlt, faSun, faCloud, faCloudRain, faCloudSun, faCloudShowersHeavy, faBolt, faSnowflake, faSmog, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import CustomAlertGenerator from './components/CustomAlertGenerator';
import { getWeatherData } from './services/weatherService';

const iconMap = {
  '01d': faSun,
  '01n': faSun,
  '02d': faCloudSun,
  '02n': faCloudSun,
  '03d': faCloud,
  '03n': faCloud,
  '04d': faCloud,
  '04n': faCloud,
  '09d': faCloudShowersHeavy,
  '09n': faCloudShowersHeavy,
  '10d': faCloudRain,
  '10n': faCloudRain,
  '11d': faBolt,
  '11n': faBolt,
  '13d': faSnowflake,
  '13n': faSnowflake,
  '50d': faSmog,
  '50n': faSmog
};

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const checkWeatherConditions = (data) => {
    const newAlerts = [];
    
    if (data.main.temp > 35) {
      newAlerts.push('🌡️ High Temperature Alert: Temperature is above 35°C');
    }
    if (data.main.temp < 5) {
      newAlerts.push('❄️ Low Temperature Alert: Temperature is below 5°C');
    }
    if (data.wind.speed > 20) {
      newAlerts.push('💨 Strong Wind Alert: Wind speed is above 20 km/h');
    }
    if (data.main.humidity > 80) {
      newAlerts.push('💧 High Humidity Alert: Humidity is above 80%');
    }
    if (data.weather[0].main === 'Rain') {
      newAlerts.push('🌧️ Rain Alert: Rain is expected');
    }
    if (data.weather[0].main === 'Snow') {
      newAlerts.push('🌨️ Snow Alert: Snow is expected');
    }
    if (data.weather[0].main === 'Thunderstorm') {
      newAlerts.push('⚡ Thunderstorm Alert: Thunderstorm is expected');
    }
    
    setAlerts(newAlerts);
  };

  const fetchWeatherData = async (cityName) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getWeatherData(cityName);
      setWeatherData(data);
      checkWeatherConditions(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherByCoordinates = async (lat, lon) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getWeatherData(null, lat, lon);
      setWeatherData(data);
      checkWeatherConditions(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch weather data for your location. Please try again.');
      setWeatherData(null);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationError('Unable to get your location. Please check your location settings.');
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    let interval;
    if (isAutoChecking && weatherData) {
      const checkWeather = async () => {
        if (weatherData.coord) {
          await getWeatherByCoordinates(weatherData.coord.lat, weatherData.coord.lon);
        } else {
          await fetchWeatherData(weatherData.name);
        }
      };
      
      checkWeather();
      interval = setInterval(checkWeather, 5 * 60 * 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoChecking, weatherData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const toggleAutoChecking = () => {
    setIsAutoChecking(!isAutoChecking);
  };

  return (
    <div className="container">
      <header>
        <h1>Be Alert</h1>
      </header>

      <div className="search-section">
        <form onSubmit={handleSubmit} className="search-box">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            disabled={isLoading}
          />
          <button type="submit" className="search-btn" disabled={isLoading}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        <button 
          className={`location-btn ${isLoading ? 'loading' : ''}`}
          onClick={getCurrentLocation}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faLocationDot} />
          Use My Location
        </button>
        {locationError && <div className="error-message">{locationError}</div>}
      </div>

      <main>
        {error && <div className="alert-item error">{error}</div>}
        
        {weatherData && (
          <div className="weather-info">
            <div className="current-weather">
              <h2>{weatherData.name}</h2>
              <div className="temperature">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="weather-description">
                {weatherData.weather[0].description}
              </div>
              <div className="weather-icon">
                <FontAwesomeIcon 
                  icon={iconMap[weatherData.weather[0].icon] || faSun} 
                  size="3x"
                />
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <FontAwesomeIcon icon={faWind} />
                <span>Wind: {Math.round(weatherData.wind.speed)} km/h</span>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faTint} />
                <span>Humidity: {weatherData.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faCompressArrowsAlt} />
                <span>Pressure: {weatherData.main.pressure} hPa</span>
              </div>
            </div>

            <div className="alerts-section">
              <h3>Weather Alerts</h3>
              <div className="alerts-list">
                {alerts.length === 0 ? (
                  <div className="alert-item">No weather alerts at this time</div>
                ) : (
                  alerts.map((alert, index) => (
                    <div key={index} className="alert-item">
                      {alert}
                    </div>
                  ))
                )}
              </div>
            </div>

            <CustomAlertGenerator weatherData={weatherData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 
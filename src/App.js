import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faMoon, faCloud, faCloudSun, 
  faCloudMoon, faCloudRain, faCloudSunRain,
  faCloudMoonRain, faBolt, faSnowflake, 
  faSmog, faWind, faTint, faCompressArrowsAlt,
  faSearch, faSync, faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import CustomAlertGenerator from './components/CustomAlertGenerator';
import './App.css';


const API_KEY = '154563bad3002edd770740b01695beeb'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather alert thresholds
const ALERT_THRESHOLDS = {
  temp: {
    high: 35, // High temperature alert threshold (°C)
    low: 5    // Low temperature alert threshold (°C)
  },
  wind: 30,     // High wind speed alert threshold (km/h)
  humidity: {
    high: 80, // High humidity alert threshold (%)
    low: 20   // Low humidity alert threshold (%)
  }
};

// Weather icon mapping
const iconMap = {
  '01d': faSun,
  '01n': faMoon,
  '02d': faCloudSun,
  '02n': faCloudMoon,
  '03d': faCloud,
  '03n': faCloud,
  '04d': faCloud,
  '04n': faCloud,
  '09d': faCloudRain,
  '09n': faCloudRain,
  '10d': faCloudSunRain,
  '10n': faCloudMoonRain,
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
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const getWeatherByCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setCity(data.name);
        checkWeatherAlerts(data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        setError(data.message || 'Error fetching weather data');
        setWeatherData(null);
        setAlerts([]);
      }
    } catch (error) {
      setError('Error fetching weather data');
      setWeatherData(null);
      setAlerts([]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationError('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  const getWeatherData = async (cityName) => {
    if (!cityName) {
      setError('Please enter a city name');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        checkWeatherAlerts(data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        setError(data.message || 'City not found');
        setWeatherData(null);
        setAlerts([]);
      }
    } catch (error) {
      setError('Error fetching weather data');
      setWeatherData(null);
      setAlerts([]);
      console.error('Error:', error);
    }
  };

  // Modified useEffect for auto-checking
  useEffect(() => {
    let intervalId;
    
    if (isAutoChecking) {
      if (weatherData) {
        // If we have weather data, use the city name
        getWeatherData(weatherData.name);
      } else {
        // If no weather data, try to get location
        getCurrentLocation();
      }
      
      // Set up interval for checking every 5 minutes
      intervalId = setInterval(() => {
        if (weatherData) {
          getWeatherData(weatherData.name);
        } else {
          getCurrentLocation();
        }
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoChecking]);

  const toggleAutoChecking = () => {
    setIsAutoChecking(!isAutoChecking);
    if (!isAutoChecking && !weatherData) {
      getCurrentLocation();
    }
  };

  const checkWeatherAlerts = (data) => {
    const newAlerts = [];
    const temp = data.main.temp;
    const wind = data.wind.speed;
    const humidity = data.main.humidity;

    // Temperature alerts
    if (temp >= ALERT_THRESHOLDS.temp.high) {
      newAlerts.push(`High temperature alert: ${temp}°C`);
    } else if (temp <= ALERT_THRESHOLDS.temp.low) {
      newAlerts.push(`Low temperature alert: ${temp}°C`);
    }

    // Wind speed alert
    if (wind >= ALERT_THRESHOLDS.wind) {
      newAlerts.push(`High wind alert: ${wind} km/h`);
    }

    // Humidity alerts
    if (humidity >= ALERT_THRESHOLDS.humidity.high) {
      newAlerts.push(`High humidity alert: ${humidity}%`);
    } else if (humidity <= ALERT_THRESHOLDS.humidity.low) {
      newAlerts.push(`Low humidity alert: ${humidity}%`);
    }

    setAlerts(newAlerts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeatherData(city);
  };

  return (
    <div className="container">
      <header>
        <h1>Be Alert</h1>
        <div className="location-controls">
          <button 
            className={`location-btn ${isLoading ? 'loading' : ''}`}
            onClick={getCurrentLocation}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faLocationDot} />
            {isLoading ? 'Getting Location...' : 'Use My Location'}
          </button>
          {locationError && <div className="error-message">{locationError}</div>}
        </div>
        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </header>

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
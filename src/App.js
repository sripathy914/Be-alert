import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faMoon, faCloud, faCloudSun, 
  faCloudMoon, faCloudRain, faCloudSunRain,
  faCloudMoonRain, faBolt, faSnowflake, 
  faSmog, faWind, faTint, faCompressArrowsAlt,
  faSearch
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
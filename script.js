// OpenWeatherMap API configuration
const API_KEY = '154563bad3002edd770740b01695beeb'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherIcon = document.getElementById('weatherIcon');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const alertsList = document.getElementById('alertsList');

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

// Event Listeners
searchBtn.addEventListener('click', getWeatherData);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherData();
    }
});

// Get weather data from API
async function getWeatherData() {
    const city = cityInput.value.trim();
    if (!city) {
        showAlert('Please enter a city name', 'error');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            updateWeatherUI(data);
            checkWeatherAlerts(data);
        } else {
            showAlert(data.message || 'City not found', 'error');
        }
    } catch (error) {
        showAlert('Error fetching weather data', 'error');
        console.error('Error:', error);
    }
}

// Update the UI with weather data
function updateWeatherUI(data) {
    cityName.textContent = data.name;
    temp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    windSpeed.textContent = Math.round(data.wind.speed);
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    updateWeatherIcon(iconCode);
}

// Update weather icon based on weather condition
function updateWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'cloud-sun',
        '02n': 'cloud-moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'cloud',
        '04n': 'cloud',
        '09d': 'cloud-rain',
        '09n': 'cloud-rain',
        '10d': 'cloud-sun-rain',
        '10n': 'cloud-moon-rain',
        '11d': 'bolt',
        '11n': 'bolt',
        '13d': 'snowflake',
        '13n': 'snowflake',
        '50d': 'smog',
        '50n': 'smog'
    };

    weatherIcon.className = `fas fa-${iconMap[iconCode] || 'sun'}`;
}

// Check weather conditions and generate alerts
function checkWeatherAlerts(data) {
    const alerts = [];
    const temp = data.main.temp;
    const wind = data.wind.speed;
    const humidity = data.main.humidity;

    // Temperature alerts
    if (temp >= ALERT_THRESHOLDS.temp.high) {
        alerts.push(`High temperature alert: ${temp}°C`);
    } else if (temp <= ALERT_THRESHOLDS.temp.low) {
        alerts.push(`Low temperature alert: ${temp}°C`);
    }

    // Wind speed alert
    if (wind >= ALERT_THRESHOLDS.wind) {
        alerts.push(`High wind alert: ${wind} km/h`);
    }

    // Humidity alerts
    if (humidity >= ALERT_THRESHOLDS.humidity.high) {
        alerts.push(`High humidity alert: ${humidity}%`);
    } else if (humidity <= ALERT_THRESHOLDS.humidity.low) {
        alerts.push(`Low humidity alert: ${humidity}%`);
    }

    // Display alerts
    displayAlerts(alerts);
}

// Display weather alerts
function displayAlerts(alerts) {
    alertsList.innerHTML = '';
    if (alerts.length === 0) {
        alertsList.innerHTML = '<div class="alert-item">No weather alerts at this time</div>';
        return;
    }

    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert-item';
        alertElement.textContent = alert;
        alertsList.appendChild(alertElement);
    });
}

// Show general alerts (errors, etc.)
function showAlert(message, type = 'info') {
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${type}`;
    alertElement.textContent = message;
    alertsList.insertBefore(alertElement, alertsList.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 5000);
}

// Initial weather data for a default city
getWeatherData(); 
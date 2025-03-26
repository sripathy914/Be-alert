# Weather Alert App (React Version)

A modern weather alert application built with React that provides real-time weather information and alerts for various weather conditions.

## Features

- Real-time weather data for any city
- Temperature, wind speed, humidity, and pressure information
- Dynamic weather icons using Font Awesome
- Automatic weather alerts for:
  - High/low temperatures
  - High wind speeds
  - High/low humidity levels
- Responsive design for all devices
- Modern and clean user interface

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenWeatherMap API key

## Setup

1. Clone this repository or download the files
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
4. Open `src/App.js` and replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key
5. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. The app will open in your default browser at `http://localhost:3000`
2. Enter a city name in the search box
3. Click the search button or press Enter
4. View the current weather information and any active alerts
5. The app will automatically check for weather conditions that exceed the alert thresholds

## Alert Thresholds

- High Temperature: 35°C
- Low Temperature: 5°C
- High Wind Speed: 30 km/h
- High Humidity: 80%
- Low Humidity: 20%

## Technologies Used

- React 18
- Create React App
- Font Awesome Icons
- OpenWeatherMap API
- CSS3 with Flexbox and Grid
- Modern JavaScript (ES6+)

## Project Structure

```
weather-alert-app/
├── node_modules/
├── public/
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Note

Make sure you have an active internet connection to fetch weather data from the OpenWeatherMap API. 
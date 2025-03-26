import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const CustomAlertGenerator = ({ weatherData }) => {
  const [customAlert, setCustomAlert] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const generateAlert = () => {
    if (!weatherData) return;

    const temp = Math.round(weatherData.main.temp);
    const wind = Math.round(weatherData.wind.speed);
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].description;
    const city = weatherData.name;

    const alert = `🚨 Weather Alert for ${city}!\n\n` +
      `Current Conditions:\n` +
      `🌡️ Temperature: ${temp}°C\n` +
      `💨 Wind Speed: ${wind} km/h\n` +
      `💧 Humidity: ${humidity}%\n` +
      `☁️ Weather: ${condition}\n\n` +
      `Stay safe and prepared!`;

    setCustomAlert(alert);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(customAlert);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareAlert = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Weather Alert',
          text: customAlert,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="custom-alert-section">
      <h3>Custom Alert Generator</h3>
      <button 
        className="generate-btn"
        onClick={generateAlert}
        disabled={!weatherData}
      >
        Generate Alert
      </button>

      {customAlert && (
        <div className="alert-preview">
          <div className="alert-content">
            {customAlert.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <div className="alert-actions">
            <button 
              className="action-btn"
              onClick={copyToClipboard}
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              className="action-btn"
              onClick={shareAlert}
            >
              <FontAwesomeIcon icon={faShare} />
              Share
            </button>
          </div>
        </div>
      )}

      {showShareOptions && (
        <div className="share-options">
          <h4>Share via:</h4>
          <div className="share-buttons">
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(customAlert)}`, '_blank')}>
              Twitter
            </button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(customAlert)}`, '_blank')}>
              Facebook
            </button>
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(customAlert)}`, '_blank')}>
              WhatsApp
            </button>
            <button onClick={() => setShowShareOptions(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAlertGenerator; 
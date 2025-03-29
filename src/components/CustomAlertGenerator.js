import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShare } from '@fortawesome/free-solid-svg-icons';

const CustomAlertGenerator = ({ weatherData }) => {
  const [customAlert, setCustomAlert] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const generateAlert = () => {
    const temp = Math.round(weatherData.main.temp);
    const wind = Math.round(weatherData.wind.speed);
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].description;
    const city = weatherData.name;

    const alert = `🌤️ Weather Alert for ${city}!\n\n` +
      `Current Conditions:\n` +
      `🌡️ Temperature: ${temp}°C\n` +
      `💨 Wind Speed: ${wind} km/h\n` +
      `💧 Humidity: ${humidity}%\n` +
      `☁️ Weather: ${condition}\n\n` +
      `Stay safe and prepared! 🚨`;

    setCustomAlert(alert);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(customAlert);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const shareAlert = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Weather Alert',
          text: customAlert
        });
      } catch (err) {
        console.error('Error sharing:', err);
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="custom-alert-section">
      <button className="generate-btn" onClick={generateAlert}>
        Generate Custom Alert
      </button>

      {customAlert && (
        <>
          <div className="alert-preview">
            {customAlert}
          </div>

          <div className="share-controls">
            <button className="copy-btn" onClick={copyToClipboard}>
              <FontAwesomeIcon icon={faCopy} />
              Copy Alert
            </button>
            <button className="share-btn" onClick={shareAlert}>
              <FontAwesomeIcon icon={faShare} />
              Share Alert
            </button>
          </div>

          {copied && (
            <div className="copy-status visible">
              Alert copied to clipboard!
            </div>
          )}

          {showShareOptions && (
            <div className="share-options">
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(customAlert)}`, '_blank')}>
                Share on Twitter
              </button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                Share on Facebook
              </button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(customAlert)}`, '_blank')}>
                Share on WhatsApp
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomAlertGenerator; 